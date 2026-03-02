use std::net::SocketAddr;

use axum::{
    extract::{ConnectInfo, State},
    http::{HeaderMap, StatusCode},
    routing::post,
    Json, Router,
};
use sqlx::Row;
use uuid::Uuid;

use crate::dto::{
    LoginRequest, LoginResponse, LogoutRequest, ValidateRequest, ValidateResponse,
};
use crate::password::verify_password;
use crate::session::{
    create_session, hash_device_ua, normalise_device_ua, revoke_session, validate_session,
};
use crate::state::AppState;

pub fn router() -> Router<AppState> {
    Router::<AppState>::new()
        .route("/v1/auth/login", post(login))
        .route("/v1/auth/validate", post(validate))
        .route("/v1/auth/logout", post(logout))
}

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

async fn login(
    State(state): State<AppState>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    headers: HeaderMap,
    Json(body): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, StatusCode> {
    let device_ua_hash = extract_device_ua_hash(&headers)?;

    let row = sqlx::query(
        "SELECT id, email, password_hash, disabled FROM users WHERE email = $1",
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

    let payload = serde_json::to_vec(&serde_json::json!({
        "user_id": user_id,
        "email": email,
        "session_id": session.id,
    }))
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    state.nats.publish("auth.login".to_string(), payload.into()).await;


    Ok(Json(LoginResponse {
        access_token: session.session_token,
        expires_in: 60 * 60,
    }))
}

async fn validate(
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

async fn logout(
    State(state): State<AppState>,
    Json(body): Json<LogoutRequest>,
) -> Result<StatusCode, StatusCode> {
    revoke_session(&state.db, &body.token)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    Ok(StatusCode::NO_CONTENT)
}

