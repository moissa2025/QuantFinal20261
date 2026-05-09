use std::sync::Arc;

use axum::{
    extract::{Extension, TypedHeader},
    http::HeaderMap,
    routing::post,
    Json, Router,
};
use headers::UserAgent;
use serde::Deserialize;

use crate::{error::AppError, state::AppState};

use common::auth_messages::{
    RegisterRequest,
    RegisterResponse,
    ActivateResponse,
    AuthLoginResponse,
    AuthRefreshResponse,
    AuthValidateSessionResponse,
    AuthMfaVerifyRequest,
    AuthMfaVerifyResponse,
    AuthMfaSetupRequest,
    AuthMfaSetupResponse,
};

fn extract_ip(headers: &HeaderMap) -> String {
    headers
        .get("x-forwarded-for")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("0.0.0.0")
        .to_string()
}

fn extract_ua(ua: Option<TypedHeader<UserAgent>>) -> String {
    ua.map(|TypedHeader(ua)| ua.to_string())
        .unwrap_or_else(|| "api-gateway".into())
}

#[derive(Deserialize)]
pub struct LoginBody {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct RefreshBody {
    pub refresh_token: String,
}

#[derive(Deserialize)]
pub struct ActivateBody {
    pub token: String,
}

#[derive(Deserialize)]
pub struct ValidateBody {
    pub session_token: String,
}

#[derive(Deserialize)]
pub struct LogoutBody {
    pub session_token: String,
}

pub fn router() -> Router {
    Router::new()
        .route("/register", post(register))
        .route("/activate", post(activate))
        .route("/login", post(login))
        .route("/refresh", post(refresh))
        .route("/validate", post(validate_session))
        .route("/logout", post(logout))
        .route("/mfa/verify", post(verify_mfa))
        .route("/mfa/setup", post(setup_totp))
}

pub async fn register(
    Extension(state): Extension<Arc<AppState>>,
    Json(body): Json<RegisterRequest>,
) -> Result<Json<RegisterResponse>, AppError> {
    let res = state.auth_nats.register(body).await?;
    Ok(Json(res))
}

pub async fn activate(
    Extension(state): Extension<Arc<AppState>>,
    Json(body): Json<ActivateBody>,
) -> Result<Json<ActivateResponse>, AppError> {
    let res = state.auth_nats.activate(body.token).await?;
    Ok(Json(res))
}

pub async fn login(
    Extension(state): Extension<Arc<AppState>>,
    headers: HeaderMap,
    Json(body): Json<LoginBody>,
) -> Result<Json<AuthLoginResponse>, AppError> {
    let ip = extract_ip(&headers);

    let ua_str = headers
        .get("user-agent")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("api-gateway")
        .to_string();

    let res = state
        .auth_nats
        .login(body.email, body.password, ip, ua_str)
        .await?;

    Ok(Json(res))
}

pub async fn refresh(
    Extension(state): Extension<Arc<AppState>>,
    headers: HeaderMap,
    Json(body): Json<RefreshBody>,
) -> Result<Json<AuthRefreshResponse>, AppError> {
    let ip = extract_ip(&headers);

    let ua_str = headers
        .get("user-agent")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("api-gateway")
        .to_string();

    let res = state
        .auth_nats
        .refresh(body.refresh_token, ip, ua_str)
        .await?;

    Ok(Json(res))
}

pub async fn validate_session(
    Extension(state): Extension<Arc<AppState>>,
    headers: HeaderMap,
    Json(body): Json<ValidateBody>,
) -> Result<Json<AuthValidateSessionResponse>, AppError> {
    let ip = extract_ip(&headers);

    let ua_str = headers
        .get("user-agent")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("api-gateway")
        .to_string();

    let res = state
        .auth_nats
        .validate_session(body.session_token, ip, ua_str)
        .await?;

    Ok(Json(res))
}

pub async fn logout(
    Extension(state): Extension<Arc<AppState>>,
    Json(body): Json<LogoutBody>,
) -> Result<(), AppError> {
    state.auth_nats.logout(body.session_token).await?;
    Ok(())
}

pub async fn verify_mfa(
    Extension(state): Extension<Arc<AppState>>,
    Json(body): Json<AuthMfaVerifyRequest>,
) -> Result<Json<AuthMfaVerifyResponse>, AppError> {
    let res = state.auth_nats.verify_mfa(body).await?;
    Ok(Json(res))
}

pub async fn setup_totp(
    Extension(state): Extension<Arc<AppState>>,
    Json(body): Json<AuthMfaSetupRequest>,
) -> Result<Json<AuthMfaSetupResponse>, AppError> {
    let res = state.auth_nats.setup_totp(body).await?;
    Ok(Json(res))
}

