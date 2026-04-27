use async_nats::{Client, Message};
use serde_json;
use tracing::error;
use sqlx::Row;
use uuid::Uuid;

use common::auth_messages::{
    AuthMfaSetupRequest,
    AuthMfaSetupResponse,
};

use crate::db::DbPool;
use crate::crypto::totp::{generate_totp_secret, generate_totp_qr, verify_totp};

pub async fn handle_mfa_setup(pool: DbPool, nats: Client, msg: Message) {
    let req: AuthMfaSetupRequest = match serde_json::from_slice(&msg.payload) {
        Ok(r) => r,
        Err(e) => {
            error!("mfa_setup: invalid payload: {}", e);
            return;
        }
    };

    let user_id = match Uuid::parse_str(&req.user_id) {
        Ok(id) => id,
        Err(_) => return,
    };

    // Load email
    let row = match sqlx::query(
        r#"SELECT email FROM auth.users WHERE id = $1"#
    )
    .bind(user_id)
    .fetch_optional(&pool)
    .await
    {
        Ok(Some(r)) => r,
        _ => return,
    };

    let email: String = row.get("email");

    // Generate secret + QR
    let secret = generate_totp_secret();
    let qr_svg_bytes = generate_totp_qr(&email, &secret);
    let qr_svg = String::from_utf8(qr_svg_bytes).unwrap_or_default();

    // Store secret (disabled until verified)
    sqlx::query(
        r#"
        INSERT INTO auth.totp (user_id, secret, enabled)
        VALUES ($1, $2, false)
        ON CONFLICT (user_id)
        DO UPDATE SET secret = EXCLUDED.secret, enabled = false
        "#
    )
    .bind(user_id)
    .bind(&secret)
    .execute(&pool)
    .await
    .ok();

    // Validate first TOTP code
    if !verify_totp(&secret, &req.code) {
        let resp = AuthMfaSetupResponse {
            ok: false,
            secret: None,
            qr_code: None,
        };

        if let Some(reply) = msg.reply {
            let _ = nats.publish(reply, serde_json::to_vec(&resp).unwrap().into()).await;
        }
        return;
    }

    // Enable TOTP
    let _ = sqlx::query(
        "UPDATE auth.totp SET enabled = true WHERE user_id = $1"
    )
    .bind(user_id)
    .execute(&pool)
    .await;

    // Build response
    let resp = AuthMfaSetupResponse {
        ok: true,
        secret: Some(secret),
        qr_code: Some(qr_svg),
    };

    if let Some(reply) = msg.reply {
        let _ = nats.publish(reply, serde_json::to_vec(&resp).unwrap().into()).await;
    }
}

