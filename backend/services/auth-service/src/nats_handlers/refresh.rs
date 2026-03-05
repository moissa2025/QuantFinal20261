use async_nats::{Client, Message};
use chrono::Utc;
use serde_json;

use common::auth_messages::{AuthRefreshRequest, AuthRefreshResponse};

use crate::db::DbPool;
use crate::session::create_session;
use crate::crypto::refresh_token::{
    hash_refresh_token,
    decrypt_refresh_token,
    generate_refresh_token,
    encrypt_refresh_token,
};

//
// Local helpers (refresh.rs needs its own respond_raw/respond_json)
//
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

//
// REFRESH HANDLER
//
pub async fn handle_refresh(pool: DbPool, nats: Client, msg: Message) {
    //
    // 1. Parse request
    //
    let req: AuthRefreshRequest = match serde_json::from_slice(&msg.payload) {
        Ok(r) => r,
        Err(_) => {
            respond_raw(&nats, &msg, b"invalid request").await;
            return;
        }
    };

    //
    // 2. Hash incoming refresh token
    //
    let incoming_hash = hash_refresh_token(&req.refresh_token);

    //
    // 3. Lookup refresh token record
    //
    let rec = match sqlx::query!(
        r#"
        SELECT id, user_id, expires_at, revoked, ciphertext, nonce
        FROM refresh_tokens
        WHERE token_hash = $1
        "#,
        incoming_hash
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

    //
    // 4. Check expiry + revocation
    //
    if rec.revoked || rec.expires_at < Utc::now() {
        respond_raw(&nats, &msg, b"unauthorized").await;
        return;
    }

    //
    // 5. Decrypt stored ciphertext and verify plaintext matches
    //
    let decrypted = match decrypt_refresh_token(&rec.ciphertext, &rec.nonce) {
        Ok(p) => p,
        Err(_) => {
            respond_raw(&nats, &msg, b"unauthorized").await;
            return;
        }
    };

    if decrypted != req.refresh_token {
        respond_raw(&nats, &msg, b"unauthorized").await;
        return;
    }

    //
    // 6. Revoke old refresh token
    //
    let _ = sqlx::query!(
        r#"UPDATE refresh_tokens SET revoked = true WHERE id = $1"#,
        rec.id
    )
    .execute(&pool)
    .await;

    //
    // 7. Generate + encrypt new refresh token
    //
    let new_plain = generate_refresh_token();
    let new_hash = hash_refresh_token(&new_plain);

    let (new_ciphertext, new_nonce) = match encrypt_refresh_token(&new_plain) {
        Ok(v) => v,
        Err(_) => {
            respond_raw(&nats, &msg, b"error").await;
            return;
        }
    };

    let expires_at = Utc::now() + chrono::Duration::days(30);
    let new_id = uuid::Uuid::new_v4();

    let _ = sqlx::query!(
        r#"
        INSERT INTO refresh_tokens (
            id, user_id, token_hash, ciphertext, nonce, expires_at, revoked, replaced_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, false, NULL)
        "#,
        new_id,
        rec.user_id,
        new_hash,
        new_ciphertext,
        new_nonce,
        expires_at
    )
    .execute(&pool)
    .await;

    //
    // 8. Create new session
    //
    let session = match create_session(
        &pool,
        rec.user_id,
        req.ip_address.clone(),
        req.user_agent.clone(),
    )
    .await
    {
        Ok(s) => s,
        Err(_) => {
            respond_raw(&nats, &msg, b"error").await;
            return;
        }
    };

    //
    // 9. Respond with new session + refresh token
    //
    let res = AuthRefreshResponse {
        user_id: rec.user_id.to_string(),
        session_token: session.session_token,
        refresh_token: new_plain,
        ttl_seconds: 3600,
    };

    respond_json(&nats, &msg, &res).await;
}

