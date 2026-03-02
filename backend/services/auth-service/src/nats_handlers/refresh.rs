use async_nats::{Client, Message};
use serde_json;
use chrono::Utc;
use rand::RngCore;

use common::auth_messages::{AuthRefreshRequest, AuthRefreshResponse};

use crate::db::DbPool;
use crate::session::create_session;

pub async fn handle_refresh(pool: DbPool, nats: Client, msg: Message) {
    let req: AuthRefreshRequest = match serde_json::from_slice(&msg.payload) {
        Ok(r) => r,
        Err(_) => {
            respond_raw(&nats, &msg, b"invalid request").await;
            return;
        }
    };

    //
    // 1. Lookup refresh token
    //
    let rec = match sqlx::query!(
        r#"SELECT id, user_id, expires_at, revoked
           FROM refresh_tokens
           WHERE token_hash = $1"#,
        req.refresh_token
    )
    .fetch_optional(&pool)
    .await
    {
        Ok(Some(r)) => r,
        _ => {
            respond_raw(&nats, &msg, b"unauthorized").await;
            return;
        }
    };

    if rec.revoked || rec.expires_at < Utc::now() {
        respond_raw(&nats, &msg, b"unauthorized").await;
        return;
    }

    //
    // 2. Revoke old token
    //
    let _ = sqlx::query!(
        r#"UPDATE refresh_tokens SET revoked = true WHERE id = $1"#,
        rec.id
    )
    .execute(&pool)
    .await;

    //
    // 3. Generate new refresh token
    //
    let mut bytes = [0u8; 32];
    rand::thread_rng().fill_bytes(&mut bytes);
    use base64::engine::general_purpose::STANDARD;
    use base64::Engine;

    let new_refresh_token = STANDARD.encode(bytes);

    let expires_at = Utc::now() + chrono::Duration::days(30);

    let _ = sqlx::query!(
        r#"INSERT INTO refresh_tokens (user_id, token_hash, expires_at, revoked)
           VALUES ($1, $2, $3, false)"#,
        rec.user_id,
        new_refresh_token,
        expires_at
    )
    .execute(&pool)
    .await;

    //
    // 4. Create new session
    //
    let session = create_session(
        &pool,
        rec.user_id,
        req.ip_address.clone(),
        req.user_agent.clone(),
    )
    .await
    .unwrap();

    //
    // 5. Respond
    //
    let res = AuthRefreshResponse {
        user_id: rec.user_id.to_string(),
        session_token: session.session_token,
        refresh_token: new_refresh_token,
        ttl_seconds: 3600,
    };

    respond_json(&nats, &msg, &res).await;
}

async fn respond_raw(nats: &Client, msg: &Message, bytes: &[u8]) {
    if let Some(reply) = msg.reply.clone() {
        let _ = nats.publish(reply, bytes.to_vec().into()).await;
    }
}

async fn respond_json<T: serde::Serialize>(nats: &Client, msg: &Message, value: &T) {
    if let Some(reply) = msg.reply.clone() {
        let payload = serde_json::to_vec(value).unwrap();
        let _ = nats.publish(reply, payload.into()).await;
    }
}

