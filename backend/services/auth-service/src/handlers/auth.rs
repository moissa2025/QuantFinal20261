use axum::response::IntoResponse;

use axum::{
    extract::{ConnectInfo, State},
    http::{HeaderMap, StatusCode},
    Json,
};
use std::net::SocketAddr;

use sqlx::Row;
use uuid::Uuid;

use crate::{
    dto::{
        LoginRequest, LoginResponse,
        ValidateRequest, ValidateResponse,
        LogoutRequest,
        RefreshRequest, RefreshResponse,
        RegisterRequest, RegisterResponse,
    },
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
// DEVICE FINGERPRINT EXTRACTION
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

    //
    // Generate encrypted refresh token
    //
    let refresh_plain = generate_refresh_token();
    let refresh_hash = hash_refresh_token(&refresh_plain);
    let (ciphertext, nonce) = encrypt_refresh_token(&refresh_plain)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let expires_at = Utc::now() + chrono::Duration::days(30);

    sqlx::query!(
        r#"
        INSERT INTO auth.refresh_tokens (id, user_id, token_hash, ciphertext, nonce, expires_at, revoked)
        VALUES ($1, $2, $3, $4, $5, $6, false)
        "#,
        Uuid::new_v4(),
        user_id,
        refresh_hash,
        ciphertext,
        nonce,
        expires_at
    )
    .execute(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    //
    // Emit NATS event
    //
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
        expires_in: 60 * 60,
    }))
}

//
// VALIDATE SESSION
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
// REFRESH TOKEN
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

    let rec = sqlx::query!(
        r#"
        SELECT id, user_id, expires_at, revoked, ciphertext, nonce
        FROM auth.refresh_tokens
        WHERE token_hash = $1
        "#,
        incoming_hash
    )
    .fetch_optional(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let Some(rec) = rec else {
        return Err(StatusCode::UNAUTHORIZED);
    };

    if rec.revoked || rec.expires_at < Utc::now() {
        return Err(StatusCode::UNAUTHORIZED);
    }

    let decrypted = decrypt_refresh_token(&rec.ciphertext, &rec.nonce)
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    if decrypted != body.refresh_token {
        return Err(StatusCode::UNAUTHORIZED);
    }

    sqlx::query!(
        r#"UPDATE auth.refresh_tokens SET revoked = true WHERE id = $1"#,
        rec.id
    )
    .execute(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let new_plain = generate_refresh_token();
    let new_hash = hash_refresh_token(&new_plain);
    let (new_ciphertext, new_nonce) = encrypt_refresh_token(&new_plain)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let expires_at = Utc::now() + chrono::Duration::days(30);

    sqlx::query!(
        r#"
        INSERT INTO auth.refresh_tokens (id, user_id, token_hash, ciphertext, nonce, expires_at, revoked)
        VALUES ($1, $2, $3, $4, $5, $6, false)
        "#,
        Uuid::new_v4(),
        rec.user_id,
        new_hash,
        new_ciphertext,
        new_nonce,
        expires_at
    )
    .execute(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let session = create_session(
        &state.db,
        rec.user_id,
        Some(ip.clone()),
        Some(device_ua_hash),
    )
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(RefreshResponse {
        access_token: session.session_token,
        refresh_token: new_plain,
        expires_in: 60 * 60,
    }))
}

//
// REGISTER
//
pub async fn register(
    State(state): State<AppState>,
    Json(body): Json<RegisterRequest>,
) -> Result<Json<RegisterResponse>, StatusCode> {
    let existing = sqlx::query!(
        r#"SELECT id FROM auth.users WHERE email = $1"#,
        body.email
    )
    .fetch_optional(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    if existing.is_some() {
    	return Err(StatusCode::CONFLICT); // 409
    }

    let password_hash = hash_password(&body.password)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let user_id = Uuid::new_v4();

    sqlx::query!(
        r#"
        INSERT INTO auth.users (id, email, password_hash, disabled)
        VALUES ($1, $2, $3, false)
        "#,
        user_id,
        body.email,
        password_hash
    )
    .execute(&state.db)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(RegisterResponse {
        user_id: user_id.to_string(),
    }))
}

