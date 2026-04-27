use async_nats::{Client, Message};
use serde_json;
use tracing::error;
use sqlx::Row;
use uuid::Uuid;

use common::auth_messages::{
    AuthMfaVerifyRequest,
    AuthMfaVerifyResponse,
};

use crate::db::DbPool;
use crate::crypto::totp::verify_totp;
use crate::crypto::refresh_token::{
    generate_refresh_token,
    hash_refresh_token,
    encrypt_refresh_token,
};
use crate::session::create_session;

pub async fn handle_mfa_verify(pool: DbPool, nats: Client, msg: Message) {
    // 1. Parse request
    let req: AuthMfaVerifyRequest = match serde_json::from_slice(&msg.payload) {
        Ok(r) => r,
        Err(e) => {
            error!("mfa_verify: invalid payload: {}", e);
            return;
        }
    };

    // 2. Parse user_id
    let user_id = match Uuid::parse_str(&req.user_id) {
        Ok(id) => id,
        Err(_) => return,
    };

    // 3. Verify MFA method
    let user_id = match req.method.as_str() {
        "email" => {
            let row = match sqlx::query(
                r#"
                SELECT user_id
                FROM auth.email_otp
                WHERE user_id = $1 AND code = $2 AND expires_at > now()
                "#
            )
            .bind(user_id)
            .bind(&req.code)
            .fetch_optional(&pool)
            .await
            {
                Ok(Some(r)) => r,
                _ => return,
            };

            let uid: Uuid = row.get("user_id");

            // delete OTP
            let _ = sqlx::query(
                "DELETE FROM auth.email_otp WHERE user_id = $1"
            )
            .bind(uid)
            .execute(&pool)
            .await;

            uid
        }

        "totp" => {
            let row = match sqlx::query(
                r#"SELECT secret, enabled FROM auth.totp WHERE user_id = $1"#
            )
            .bind(user_id)
            .fetch_optional(&pool)
            .await
            {
                Ok(Some(r)) => r,
                _ => return,
            };

            let secret: String = row.get("secret");

            if !verify_totp(&secret, &req.code) {
                return;
            }

            // enable TOTP
            let _ = sqlx::query(
                "UPDATE auth.totp SET enabled = true WHERE user_id = $1"
            )
            .bind(user_id)
            .execute(&pool)
            .await;

            user_id
        }

        _ => return,
    };

    // 4. Create session
    let session = match create_session(&pool, user_id, None, None).await {
        Ok(s) => s,
        Err(_) => return,
    };

    // 5. Generate refresh token
    let refresh_plain = generate_refresh_token();
    let refresh_hash = hash_refresh_token(&refresh_plain);
    let (ciphertext, nonce) = encrypt_refresh_token(&refresh_plain).unwrap();
    let expires_at = chrono::Utc::now() + chrono::Duration::days(30);

    sqlx::query(
        r#"
        INSERT INTO auth.refresh_tokens (id, user_id, token_hash, ciphertext, nonce, expires_at, revoked)
        VALUES ($1, $2, $3, $4, $5, $6, false)
        "#
    )
    .bind(Uuid::new_v4())
    .bind(user_id)
    .bind(&refresh_hash)
    .bind(&ciphertext)
    .bind(&nonce)
    .bind(expires_at)
    .execute(&pool)
    .await
    .ok();

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

    // 7. Build NATS response (matches common/auth_messages.rs)
    let resp = AuthMfaVerifyResponse {
        ok: true,
        session_token: Some(session.session_token),
        refresh_token: Some(refresh_plain),
        roles,
    };

    // 8. Publish reply
    if let Some(reply) = msg.reply {
        let _ = nats.publish(reply, serde_json::to_vec(&resp).unwrap().into()).await;
    }
}

