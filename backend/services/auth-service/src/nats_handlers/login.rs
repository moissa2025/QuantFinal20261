use async_nats::{Client, Message};
use serde_json;
use tracing::{error, info, warn};
use chrono::Utc;
use uuid::Uuid;

use common::auth_messages::{AuthLoginRequest, AuthLoginResponse};

use crate::{
    db::DbPool,
    session::{normalise_device_ua, hash_device_ua, create_session},
    password::verify_password,
    crypto::refresh_token::{
        generate_refresh_token,
        hash_refresh_token,
        encrypt_refresh_token,
    },
};

//
// Local helper for NATS replies
//
async fn respond<T: serde::Serialize>(nats: &Client, msg: &Message, value: &T) {
    if let Some(reply) = msg.reply.clone() {
        let payload = serde_json::to_vec(value).unwrap();
        let _ = nats.publish(reply, payload.into()).await;
    }
}

//
// LOGIN HANDLER
//
pub async fn handle_login(pool: DbPool, nats: Client, msg: Message) {
    let req: AuthLoginRequest = match serde_json::from_slice(&msg.payload) {
        Ok(r) => r,
        Err(e) => {
            error!("login: invalid request payload: {}", e);
            respond(&nats, &msg, &AuthLoginResponse {
                user_id: "".into(),
                session_token: "".into(),
                roles: vec![],
                ttl_seconds: 0,
                refresh_token: None,
            }).await;
            return;
        }
    };

    info!("login: authenticating {}", req.email);

    //
    // 1. Load user
    //
    let user = match sqlx::query!(
        r#"SELECT id, password_hash, disabled
           FROM users
           WHERE email = $1"#,
        req.email
    )
    .fetch_optional(&pool)
    .await
    {
        Ok(Some(u)) => u,
        Ok(None) => {
            warn!("login: invalid credentials");
            respond(&nats, &msg, &AuthLoginResponse {
                user_id: "".into(),
                session_token: "".into(),
                roles: vec![],
                ttl_seconds: 0,
                refresh_token: None,
            }).await;
            return;
        }
        Err(e) => {
            error!("login: DB error: {}", e);
            respond(&nats, &msg, &AuthLoginResponse {
                user_id: "".into(),
                session_token: "".into(),
                roles: vec![],
                ttl_seconds: 0,
                refresh_token: None,
            }).await;
            return;
        }
    };

    if user.disabled {
        warn!("login: user disabled");
        respond(&nats, &msg, &AuthLoginResponse {
            user_id: "".into(),
            session_token: "".into(),
            roles: vec![],
            ttl_seconds: 0,
            refresh_token: None,
        }).await;
        return;
    }

    //
    // 2. Verify password
    //
    if !verify_password(&req.password, &user.password_hash).unwrap_or(false) {
        warn!("login: invalid credentials (password mismatch)");
        respond(&nats, &msg, &AuthLoginResponse {
            user_id: "".into(),
            session_token: "".into(),
            roles: vec![],
            ttl_seconds: 0,
            refresh_token: None,
        }).await;
        return;
    }

    //
    // 3. Device fingerprinting
    //
    let ua_norm = req.user_agent.as_ref().map(|ua| normalise_device_ua(ua));
    let _device_hash = ua_norm.as_ref().map(|n| hash_device_ua(n));

    //
    // 4. Create session
    //
    let session = match create_session(
        &pool,
        user.id,
        req.ip_address.clone(),
        req.user_agent.clone(),
    )
    .await
    {
        Ok(s) => s,
        Err(e) => {
            error!("login: failed to create session: {}", e);
            respond(&nats, &msg, &AuthLoginResponse {
                user_id: "".into(),
                session_token: "".into(),
                roles: vec![],
                ttl_seconds: 0,
                refresh_token: None,
            }).await;
            return;
        }
    };

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
        user.id
    )
    .fetch_all(&pool)
    .await
    {
        Ok(rows) => rows.into_iter().map(|r| r.name).collect::<Vec<_>>(),
        Err(e) => {
            error!("login: failed to load roles: {}", e);
            vec![]
        }
    };

    //
    // 6. Generate encrypted refresh token
    //
    let refresh_plain = generate_refresh_token();
    let refresh_hash = hash_refresh_token(&refresh_plain);

    let (ciphertext, nonce) = match encrypt_refresh_token(&refresh_plain) {
        Ok(v) => v,
        Err(e) => {
            error!("login: failed to encrypt refresh token: {}", e);
            respond(&nats, &msg, &AuthLoginResponse {
                user_id: "".into(),
                session_token: "".into(),
                roles: vec![],
                ttl_seconds: 0,
                refresh_token: None,
            }).await;
            return;
        }
    };

    let expires_at = Utc::now() + chrono::Duration::days(30);

    if let Err(e) = sqlx::query!(
        r#"
        INSERT INTO refresh_tokens (id, user_id, token_hash, ciphertext, nonce, expires_at, revoked)
        VALUES ($1, $2, $3, $4, $5, $6, false)
        "#,
        Uuid::new_v4(),
        user.id,
        refresh_hash,
        ciphertext,
        nonce,
        expires_at
    )
    .execute(&pool)
    .await
    {
        error!("login: failed to insert refresh token: {}", e);
        respond(&nats, &msg, &AuthLoginResponse {
            user_id: "".into(),
            session_token: "".into(),
            roles: vec![],
            ttl_seconds: 0,
            refresh_token: None,
        }).await;
        return;
    }

    //
    // 7. Respond
    //
    let response = AuthLoginResponse {
        user_id: user.id.to_string(),
        session_token: session.session_token,
        roles,
        ttl_seconds: 3600,
        refresh_token: Some(refresh_plain),
    };

    respond(&nats, &msg, &response).await;
}

