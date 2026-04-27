use crate::dto::{
    ActivateRequest, ActivateResponse,
    VerifyMfaRequest, VerifyMfaResponse,
    SetupTotpRequest, SetupTotpResponse,
    LoginRequest, LoginResponse,
    ValidateRequest, ValidateResponse,
    LogoutRequest,
    RefreshRequest, RefreshResponse,
    RegisterRequest, RegisterResponse,
};
use crate::crypto::totp::{generate_totp_secret, generate_totp_qr, verify_totp};
use crate::crypto::email_otp::generate_email_otp;

use axum::{
    extract::{ConnectInfo, State},
    http::{HeaderMap, StatusCode},
    Json,
};
use std::net::SocketAddr;

use sqlx::Row;
use uuid::Uuid;

use crate::{
    state::AppState,
    session::{create_session, validate_session, revoke_session, normalise_device_ua, hash_device_ua},
    password::{verify_password, hash_password},
    crypto::refresh_token::{
        generate_refresh_token,
        hash_refresh_token,
        encrypt_refresh_token,
        decrypt_refresh_token,
    },
};

use chrono::Utc;

//
// ACTIVATE
//
pub async fn activate(
    State(state): State<AppState>,
    Json(body): Json<ActivateRequest>,
) -> Result<Json<ActivateResponse>, StatusCode> {
    let rec = sqlx::query(
        r#"
        SELECT user_id, expires_at
        FROM auth.activation_tokens
        WHERE token = $1
        "#
    )
    .bind(&body.token)
    .fetch_optional(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let Some(row) = rec else {
        return Err(StatusCode::UNAUTHORIZED);
    };

    let user_id: Uuid = row.get("user_id");
    let expires_at: chrono::DateTime<Utc> = row.get("expires_at");

    if expires_at < Utc::now() {
        return Err(StatusCode::UNAUTHORIZED);
    }

    sqlx::query(
        r#"UPDATE auth.users SET disabled = false WHERE id = $1"#
    )
    .bind(user_id)
    .execute(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    sqlx::query(
        r#"DELETE FROM auth.activation_tokens WHERE user_id = $1"#
    )
    .bind(user_id)
    .execute(&state.db)
    .await
    .ok();

    Ok(Json(ActivateResponse { ok: true }))
}

//
// SETUP TOTP
//
pub async fn setup_totp(
    State(state): State<AppState>,
    Json(body): Json<SetupTotpRequest>,
) -> Result<Json<SetupTotpResponse>, StatusCode> {
    let user_id = Uuid::parse_str(&body.user_id)
        .map_err(|_| StatusCode::BAD_REQUEST)?;

    let row = sqlx::query(
        r#"SELECT email FROM auth.users WHERE id = $1"#
    )
    .bind(user_id)
    .fetch_optional(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let Some(row) = row else {
        return Err(StatusCode::NOT_FOUND);
    };

    let email: String = row.get("email");

    let secret = generate_totp_secret();
    let qr_uri = generate_totp_qr(&email, &secret);

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
    .execute(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(SetupTotpResponse {
        qr_code: qr_uri,
        secret,
    }))
}

//
// DEVICE FINGERPRINT
//
fn extract_device_ua_hash(headers: &HeaderMap) -> Result<String, StatusCode> {
    let raw = headers
        .get("x-device-ua")
        .and_then(|v| v.to_str().ok())
        .ok_or(StatusCode::BAD_REQUEST)?;

    let normalised = normalise_device_ua(raw);
    if normalised.is_empty() {
        return Err(StatusCode::BAD_REQUEST);
    }

    Ok(hash_device_ua(&normalised))
}

//
// LOGIN
//
pub async fn login(
    State(state): State<AppState>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    headers: HeaderMap,
    Json(body): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, StatusCode> {
    let device_ua_hash = extract_device_ua_hash(&headers)?;

    let row = sqlx::query(
        r#"
        SELECT id, email, password_hash, disabled
        FROM auth.users
        WHERE email = $1
        "#
    )
    .bind(&body.email)
    .fetch_optional(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let Some(row) = row else {
        return Err(StatusCode::UNAUTHORIZED);
    };

    let user_id: Uuid = row.get("id");
    let email: String = row.get("email");
    let password_hash: String = row.get("password_hash");
    let disabled: bool = row.get("disabled");

    if disabled {
        return Err(StatusCode::UNAUTHORIZED);
    }

    if !verify_password(&body.password, &password_hash).unwrap_or(false) {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let ip = addr.ip().to_string();

    let session = create_session(&state.db, user_id, Some(ip.clone()), Some(device_ua_hash))
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let refresh_plain = generate_refresh_token();
    let refresh_hash = hash_refresh_token(&refresh_plain);
    let (ciphertext, nonce) = encrypt_refresh_token(&refresh_plain)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let expires_at = Utc::now() + chrono::Duration::days(30);

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
    .execute(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let payload = serde_json::to_vec(&serde_json::json!({
        "user_id": user_id,
        "email": email,
        "session_id": session.id,
    }))
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if let Err(err) = state.nats.publish("auth.login".to_string(), payload.into()).await {
        tracing::error!("Failed to publish auth.login event: {:?}", err);
    }

    Ok(Json(LoginResponse {
        access_token: session.session_token,
        refresh_token: refresh_plain,
        expires_in: 3600,
    }))
}

//
// VALIDATE
//
pub async fn validate(
    State(state): State<AppState>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    headers: HeaderMap,
    Json(body): Json<ValidateRequest>,
) -> Result<Json<ValidateResponse>, StatusCode> {
    let device_ua_hash = extract_device_ua_hash(&headers)?;
    let ip = addr.ip().to_string();

    let result = validate_session(&state.db, &body.token, &ip, &device_ua_hash)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    match result {
        Some((user_id, email, roles)) => Ok(Json(ValidateResponse {
            valid: true,
            user_id: Some(user_id.to_string()),
            email: Some(email),
            roles: Some(roles),
        })),
        None => Ok(Json(ValidateResponse {
            valid: false,
            user_id: None,
            email: None,
            roles: None,
        })),
    }
}

//
// LOGOUT
//
pub async fn logout(
    State(state): State<AppState>,
    Json(body): Json<LogoutRequest>,
) -> Result<StatusCode, StatusCode> {
    revoke_session(&state.db, &body.token)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(StatusCode::NO_CONTENT)
}

//
// REFRESH
//
pub async fn refresh(
    State(state): State<AppState>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    headers: HeaderMap,
    Json(body): Json<RefreshRequest>,
) -> Result<Json<RefreshResponse>, StatusCode> {
    let device_ua_hash = extract_device_ua_hash(&headers)?;
    let ip = addr.ip().to_string();

    let incoming_hash = hash_refresh_token(&body.refresh_token);

    let rec = sqlx::query(
        r#"
        SELECT id, user_id, expires_at, revoked, ciphertext, nonce
        FROM auth.refresh_tokens
        WHERE token_hash = $1
        "#
    )
    .bind(&incoming_hash)
    .fetch_optional(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let Some(row) = rec else {
        return Err(StatusCode::UNAUTHORIZED);
    };

    let token_id: Uuid = row.get("id");
    let user_id: Uuid = row.get("user_id");
    let expires_at: chrono::DateTime<Utc> = row.get("expires_at");
    let revoked: bool = row.get("revoked");
    let ciphertext: Vec<u8> = row.get("ciphertext");
    let nonce: Vec<u8> = row.get("nonce");

    if revoked || expires_at < Utc::now() {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let decrypted = decrypt_refresh_token(&ciphertext, &nonce)
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    if decrypted != body.refresh_token {
        return Err(StatusCode::UNAUTHORIZED);
    }

    sqlx::query(
        r#"UPDATE auth.refresh_tokens SET revoked = true WHERE id = $1"#
    )
    .bind(token_id)
    .execute(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let new_plain = generate_refresh_token();
    let new_hash = hash_refresh_token(&new_plain);
    let (new_ciphertext, new_nonce) = encrypt_refresh_token(&new_plain)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let new_expires_at = Utc::now() + chrono::Duration::days(30);

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
    .execute(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let session = create_session(
        &state.db,
        user_id,
        Some(ip.clone()),
        Some(device_ua_hash),
    )
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(RefreshResponse {
        access_token: session.session_token,
        refresh_token: new_plain,
        expires_in: 3600,
    }))
}

//
// REGISTER
//
pub async fn register(
    State(state): State<AppState>,
    Json(body): Json<RegisterRequest>,
) -> Result<Json<RegisterResponse>, StatusCode> {
    let existing = sqlx::query(
        r#"SELECT id FROM auth.users WHERE email = $1"#
    )
    .bind(&body.email)
    .fetch_optional(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if existing.is_some() {
        return Err(StatusCode::CONFLICT);
    }

    let password_hash = hash_password(&body.password)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let user_id = Uuid::new_v4();

    sqlx::query(
        r#"
        INSERT INTO auth.users (id, email, password_hash, disabled)
        VALUES ($1, $2, $3, false)
        "#
    )
    .bind(user_id)
    .bind(&body.email)
    .bind(&password_hash)
    .execute(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(RegisterResponse {
        user_id: user_id.to_string(),
    }))
}

//
// VERIFY MFA
//
pub async fn verify_mfa(
    State(state): State<AppState>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    headers: HeaderMap,
    Json(body): Json<VerifyMfaRequest>,
) -> Result<Json<VerifyMfaResponse>, StatusCode> {
    let device_ua_hash = extract_device_ua_hash(&headers)?;
    let ip = addr.ip().to_string();

    let user_id = Uuid::parse_str(&body.user_id)
        .map_err(|_| StatusCode::BAD_REQUEST)?;

    let user_id = match body.method.as_str() {
        "email" => {
            let rec = sqlx::query(
                r#"
                SELECT user_id
                FROM auth.email_otp
                WHERE user_id = $1 AND code = $2 AND expires_at > now()
                "#
            )
            .bind(user_id)
            .bind(&body.code)
            .fetch_optional(&state.db)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            let Some(row) = rec else {
                return Err(StatusCode::UNAUTHORIZED);
            };

            let uid: Uuid = row.get("user_id");

            sqlx::query(
                "DELETE FROM auth.email_otp WHERE user_id = $1"
            )
            .bind(uid)
            .execute(&state.db)
            .await
            .ok();

            uid
        }

        "totp" => {
            let rec = sqlx::query(
                r#"SELECT secret, enabled FROM auth.totp WHERE user_id = $1"#
            )
            .bind(user_id)
            .fetch_optional(&state.db)
            .await
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            let Some(row) = rec else {
                return Err(StatusCode::UNAUTHORIZED);
            };

            let secret: String = row.get("secret");

            if !verify_totp(&secret, &body.code) {
                return Err(StatusCode::UNAUTHORIZED);
            }

            sqlx::query(
                "UPDATE auth.totp SET enabled = true WHERE user_id = $1"
            )
            .bind(user_id)
            .execute(&state.db)
            .await
            .ok();

            user_id
        }

        _ => return Err(StatusCode::BAD_REQUEST),
    };

    let session = create_session(
        &state.db,
        user_id,
        Some(ip.clone()),
        Some(device_ua_hash),
    )
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let refresh_plain = generate_refresh_token();
    let refresh_hash = hash_refresh_token(&refresh_plain);
    let (ciphertext, nonce) = encrypt_refresh_token(&refresh_plain)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let expires_at = Utc::now() + chrono::Duration::days(30);

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
    .execute(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(VerifyMfaResponse {
        access_token: session.session_token,
        refresh_token: refresh_plain,
        expires_in: 3600,
    }))
}

