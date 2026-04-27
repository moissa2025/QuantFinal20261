use async_nats::{Client, Message};
use serde_json;
use tracing::error;
use sqlx::Row;
use uuid::Uuid;

use common::auth_messages::{
    AuthRefreshRequest,
    AuthRefreshResponse,
};

use crate::db::DbPool;
use crate::crypto::refresh_token::{
    hash_refresh_token,
    decrypt_refresh_token,
    generate_refresh_token,
    encrypt_refresh_token,
};
use crate::session::create_session;

pub async fn handle_refresh(pool: DbPool, nats: Client, msg: Message) {
    let req: AuthRefreshRequest = match serde_json::from_slice(&msg.payload) {
        Ok(r) => r,
        Err(e) => {
            error!("refresh: invalid payload: {}", e);
            return;
        }
    };

    let incoming_hash = hash_refresh_token(&req.refresh_token);

    let row = match sqlx::query(
        r#"
        SELECT id, user_id, expires_at, revoked, ciphertext, nonce
        FROM auth.refresh_tokens
        WHERE token_hash = $1
        "#
    )
    .bind(&incoming_hash)
    .fetch_optional(&pool)
    .await
    {
        Ok(Some(r)) => r,
        _ => return,
    };

    let token_id: Uuid = row.get("id");
    let user_id: Uuid = row.get("user_id");
    let expires_at: chrono::DateTime<chrono::Utc> = row.get("expires_at");
    let revoked: bool = row.get("revoked");
    let ciphertext: Vec<u8> = row.get("ciphertext");
    let nonce: Vec<u8> = row.get("nonce");

    if revoked || expires_at < chrono::Utc::now() {
        return;
    }

    let decrypted = decrypt_refresh_token(&ciphertext, &nonce).unwrap();
    if decrypted != req.refresh_token {
        return;
    }

    // Revoke old token
    let _ = sqlx::query(
        r#"UPDATE auth.refresh_tokens SET revoked = true WHERE id = $1"#
    )
    .bind(token_id)
    .execute(&pool)
    .await;

    // Create new refresh token
    let new_plain = generate_refresh_token();
    let new_hash = hash_refresh_token(&new_plain);
    let (new_ciphertext, new_nonce) = encrypt_refresh_token(&new_plain).unwrap();
    let new_expires_at = chrono::Utc::now() + chrono::Duration::days(30);

    sqlx::query(
        r#"
        INSERT INTO auth.refresh_tokens (id, user_id, token_hash, ciphertext, nonce, expires_at, revoked)
        VALUES ($1, $2, $3, $4, $5, $6, false)
        "#
    )
    .bind(Uuid::new_v4())
    .bind(user_id)
    .bind(&new_hash)
    .bind(&new_ciphertext)
    .bind(&new_nonce)
    .bind(new_expires_at)
    .execute(&pool)
    .await
    .ok();

    // Create new session
    let session = create_session(&pool, user_id, req.ip_address.clone(), None)
        .await
        .unwrap();

    let resp = AuthRefreshResponse {
        user_id: user_id.to_string(),
        session_token: session.session_token,
        refresh_token: new_plain,
        ttl_seconds: 3600,
    };

    if let Some(reply) = msg.reply {
        let _ = nats.publish(reply, serde_json::to_vec(&resp).unwrap().into()).await;
    }
}

