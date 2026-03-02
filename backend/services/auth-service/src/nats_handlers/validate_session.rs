use async_nats::{Client, Message};
use chrono::Utc;
use serde_json;
use tracing::{error, info, warn};

use common::auth_messages::{
    AuthValidateSessionRequest,
    AuthValidateSessionResponse,
};

use crate::db::DbPool;

pub async fn handle_validate_session(pool: DbPool, nats: Client, msg: Message) {
    let req: AuthValidateSessionRequest = match serde_json::from_slice(&msg.payload) {
        Ok(r) => r,
        Err(e) => {
            error!("validate_session: invalid request payload: {}", e);
            respond_json(&nats, &msg, &AuthValidateSessionResponse {
                user_id: "".into(),
                roles: vec![],
                valid: false,
            }).await;
            return;
        }
    };

    info!("validate_session: validating session token");

    //
    // 1. Load session
    //
    let row = match sqlx::query!(
        r#"
        SELECT
            user_id,
            ip_address,
            user_agent,
            device_hash,
            expires_at,
            revoked,
            last_activity_at
        FROM sessions
        WHERE session_token = $1
        "#,
        req.session_token
    )
    .fetch_optional(&pool)
    .await
    {
        Ok(Some(r)) => r,
        Ok(None) => {
            respond_json(&nats, &msg, &AuthValidateSessionResponse {
                user_id: "".into(),
                roles: vec![],
                valid: false,
            }).await;
            return;
        }
        Err(e) => {
            error!("validate_session: DB error: {}", e);
            respond_json(&nats, &msg, &AuthValidateSessionResponse {
                user_id: "".into(),
                roles: vec![],
                valid: false,
            }).await;
            return;
        }
    };

    //
    // 2. Forced logout / expiry
    //
    if row.revoked || row.expires_at < Utc::now() {
        respond_json(&nats, &msg, &AuthValidateSessionResponse {
            user_id: "".into(),
            roles: vec![],
            valid: false,
        }).await;
        return;
    }

    //
    // 3. Device hash mismatch
    //
    if let Some(stored_hash) = row.device_hash.as_ref() {
        if let Some(req_ua) = req.user_agent.as_ref() {
            let normalised = crate::session::normalise_device_ua(req_ua);
            let incoming_hash = crate::session::hash_device_ua(&normalised);

            if &incoming_hash != stored_hash {
                warn!("validate_session: device hash mismatch");
                respond_json(&nats, &msg, &AuthValidateSessionResponse {
                    user_id: "".into(),
                    roles: vec![],
                    valid: false,
                }).await;
                return;
            }
        }
    }

    //
    // 4. IP drift
    //
    if let Some(stored_ip) = row.ip_address.as_ref() {
        if let Some(req_ip) = req.ip_address.as_ref() {
            let stored_ip_str = stored_ip.to_string();
            if !crate::session::same_subnet_24(&stored_ip_str, req_ip) {
                warn!("validate_session: IP drift");
                respond_json(&nats, &msg, &AuthValidateSessionResponse {
                    user_id: "".into(),
                    roles: vec![],
                    valid: false,
                }).await;
                return;
            }
        }
    }

    //
    // 5. Load roles
    //
    let roles = match sqlx::query!(
        r#"
        SELECT r.name
        FROM roles r
        JOIN user_roles ur ON ur.role_id = r.id
        WHERE ur.user_id = $1
        "#,
        row.user_id
    )
    .fetch_all(&pool)
    .await
    {
        Ok(rows) => rows.into_iter().map(|r| r.name).collect::<Vec<_>>(),
        Err(e) => {
            error!("validate_session: failed to load roles: {}", e);
            vec![]
        }
    };

    //
    // 6. Update last activity
    //
    let _ = sqlx::query!(
        r#"UPDATE sessions SET last_activity_at = $1 WHERE session_token = $2"#,
        Utc::now(),
        req.session_token
    )
    .execute(&pool)
    .await;

    //
    // 7. Respond success
    //
    respond_json(&nats, &msg, &AuthValidateSessionResponse {
        user_id: row.user_id.to_string(),
        roles,
        valid: true,
    }).await;
}

async fn respond_json<T: serde::Serialize>(nats: &Client, msg: &Message, value: &T) {
    if let Some(reply) = msg.reply.clone() {
        let payload = serde_json::to_vec(value).unwrap();
        let _ = nats.publish(reply, payload.into()).await;
    }
}

