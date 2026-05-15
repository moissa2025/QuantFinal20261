use async_nats::{Client, Message};
use serde_json;
use tracing::{error, info};
use sqlx::Row;
use uuid::Uuid;

use common::auth_messages::{
    AuthValidateSessionRequest,
    AuthValidateSessionResponse,
};

use crate::db::DbPool;
use crate::session::{normalise_device_ua, hash_device_ua};
use futures_util::StreamExt;

pub async fn listener(nats: Client, pool: DbPool) -> anyhow::Result<()> {
    let mut sub = nats.subscribe("auth.introspect_session.request").await?;

    tracing::info!("Listening on auth.introspect_session.request");

    while let Some(msg) = sub.next().await {
        let n = nats.clone();
        let p = pool.clone();

        tokio::spawn(async move {
            handle_introspect_session(p, n, msg).await;
        });
    }

    Ok(())
}

async fn respond(nats: &Client, msg: &Message, resp: &AuthValidateSessionResponse) {
    if let Some(reply) = msg.reply.clone() {
        let payload = serde_json::to_vec(resp).unwrap();
        let _ = nats.publish(reply, payload.into()).await;
    }
}

pub async fn handle_introspect_session(pool: DbPool, nats: Client, msg: Message) {
    // 1. Parse request
    let req: AuthValidateSessionRequest = match serde_json::from_slice(&msg.payload) {
        Ok(r) => r,
        Err(e) => {
            error!("introspect: invalid payload: {}", e);
            respond(&nats, &msg, &AuthValidateSessionResponse {
                valid: false,
                user_id: "".into(),
                roles: vec![],
            }).await;
            return;
        }
    };

    info!("introspect: session {}", req.session_token);

    // 2. Optional device hash
    let expected_hash = req.user_agent
        .as_ref()
        .map(|ua| hash_device_ua(&normalise_device_ua(ua)));

    // 3. Load session
    let row = match sqlx::query(
        r#"
        SELECT 
            s.user_id,
            s.device_ua_hash,
            s.expires_at,
            s.revoked
        FROM auth.sessions s
        WHERE s.session_token = $1
        "#
    )
    .bind(&req.session_token)
    .fetch_optional(&pool)
    .await
    {
        Ok(Some(r)) => r,
        _ => {
            respond(&nats, &msg, &AuthValidateSessionResponse {
                valid: false,
                user_id: "".into(),
                roles: vec![],
            }).await;
            return;
        }
    };

    let user_id: Uuid = row.get("user_id");
    let stored_hash: Option<String> = row.try_get("device_ua_hash").ok();
    let expires_at: chrono::DateTime<chrono::Utc> = row.get("expires_at");
    let revoked: bool = row.get("revoked");

    // 4. Validate session
    if revoked || expires_at < chrono::Utc::now() {
        respond(&nats, &msg, &AuthValidateSessionResponse {
            valid: false,
            user_id: "".into(),
            roles: vec![],
        }).await;
        return;
    }

    // 5. Device binding
    if let Some(expected) = expected_hash {
        if let Some(stored) = stored_hash {
            if expected != stored {
                respond(&nats, &msg, &AuthValidateSessionResponse {
                    valid: false,
                    user_id: "".into(),
                    roles: vec![],
                }).await;
                return;
            }
        }
    }

    // 6. Load roles
    let roles = sqlx::query(
        r#"
        SELECT r.name
        FROM auth.roles r
        JOIN auth.user_roles ur ON ur.role_id = r.id
        WHERE ur.user_id = $1
        "#
    )
    .bind(user_id)
    .fetch_all(&pool)
    .await
    .unwrap_or_default()
    .into_iter()
    .map(|r| r.get::<String, _>("name"))
    .collect::<Vec<_>>();

    // 7. Respond
    respond(&nats, &msg, &AuthValidateSessionResponse {
        valid: true,
        user_id: user_id.to_string(),
        roles,
    }).await;
}

