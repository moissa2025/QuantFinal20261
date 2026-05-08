use async_nats::{Client, Message};
use serde_json;
use tracing::error;
use sqlx::Row;
use uuid::Uuid;

use common::auth_messages::{AuthLoginRequest, AuthLoginResponse};

use crate::db::DbPool;
use crate::password::verify_password;
use crate::crypto::refresh_token::{
    generate_refresh_token,
    hash_refresh_token,
    encrypt_refresh_token,
};
use crate::session::{create_session, normalise_device_ua, hash_device_ua};

pub async fn handle_login(pool: DbPool, nats: Client, msg: Message) {
    let req: AuthLoginRequest = match serde_json::from_slice(&msg.payload) {
        Ok(r) => r,
        Err(e) => {
            error!("login: invalid payload: {}", e);
            return;
        }
    };

    let device_hash = req.user_agent
        .as_ref()
        .map(|ua| hash_device_ua(&normalise_device_ua(ua)));

    let row = match sqlx::query(
        r#"
        SELECT id, email, password_hash, disabled
        FROM auth.users
        WHERE email = $1
        "#
    )
    .bind(&req.email)
    .fetch_optional(&pool)
    .await
    {
        Ok(Some(r)) => r,
        _ => return,
    };

    let user_id: Uuid = row.get("id");
    let password_hash: String = row.get("password_hash");
    let disabled: bool = row.get("disabled");

    if disabled || !verify_password(&req.password, &password_hash).unwrap_or(false) {
        return;
    }

    let session = create_session(&pool, user_id, req.ip_address.clone(), device_hash)
        .await
        .unwrap();

    // Refresh token
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

    // Load roles
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

    let resp = AuthLoginResponse {
        user_id: user_id.to_string(),
        session_token: session.session_token,
        roles,
        ttl_seconds: 3600,
        refresh_token: Some(refresh_plain),
    };

    if let Some(reply) = msg.reply {
        let _ = nats.publish(reply, serde_json::to_vec(&resp).unwrap().into()).await;
    }
}

