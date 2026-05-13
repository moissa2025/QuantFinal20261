use std::sync::Arc;
use axum::{
    extract::Json,
    http::HeaderMap,
    routing::post,
    Json as AxumJson,
    Router,
    Extension,
};
use crate::{error::AppError, state::AppState};
use common::auth_messages::*;

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

fn extract_ip(headers: &HeaderMap) -> Option<String> {
    headers
        .get("x-forwarded-for")
        .and_then(|v| v.to_str().ok())
        .map(|s| s.to_string())
}

fn extract_ua(headers: &HeaderMap) -> Option<String> {
    headers
        .get("user-agent")
        .and_then(|v| v.to_str().ok())
        .map(|s| s.to_string())
}

pub async fn register(
    Extension(state): Extension<Arc<AppState>>,
    Json(body): Json<RegisterRequest>,
) -> Result<AxumJson<RegisterResponse>, AppError> {
    Ok(AxumJson(state.auth_nats.register(body).await?))
}

pub async fn activate(
    Extension(state): Extension<Arc<AppState>>,
    Json(body): Json<ActivateRequest>,
) -> Result<AxumJson<ActivateResponse>, AppError> {
    Ok(AxumJson(state.auth_nats.activate(body).await?))
}

pub async fn login(
    Extension(state): Extension<Arc<AppState>>,
    headers: HeaderMap,
    Json(mut body): Json<AuthLoginRequest>,
) -> Result<AxumJson<AuthLoginResponse>, AppError> {
    body.ip_address = extract_ip(&headers);
    body.user_agent = extract_ua(&headers);

    Ok(AxumJson(state.auth_nats.login(body).await?))
}

pub async fn refresh(
    Extension(state): Extension<Arc<AppState>>,
    headers: HeaderMap,
    Json(mut body): Json<AuthRefreshRequest>,
) -> Result<AxumJson<AuthRefreshResponse>, AppError> {
    body.ip_address = extract_ip(&headers);
    body.user_agent = extract_ua(&headers);

    Ok(AxumJson(state.auth_nats.refresh(body).await?))
}

pub async fn validate_session(
    Extension(state): Extension<Arc<AppState>>,
    headers: HeaderMap,
    Json(mut body): Json<AuthValidateSessionRequest>,
) -> Result<AxumJson<AuthValidateSessionResponse>, AppError> {
    body.ip_address = extract_ip(&headers);
    body.user_agent = extract_ua(&headers);

    Ok(AxumJson(state.auth_nats.validate_session(body).await?))
}

pub async fn logout(
    Extension(state): Extension<Arc<AppState>>,
    Json(body): Json<AuthLogoutRequest>,
) -> Result<(), AppError> {
    state.auth_nats.logout(body).await?;
    Ok(())
}

pub async fn verify_mfa(
    Extension(state): Extension<Arc<AppState>>,
    Json(body): Json<AuthMfaVerifyRequest>,
) -> Result<AxumJson<AuthMfaVerifyResponse>, AppError> {
    Ok(AxumJson(state.auth_nats.verify_mfa(body).await?))
}

pub async fn setup_totp(
    Extension(state): Extension<Arc<AppState>>,
    Json(body): Json<AuthMfaSetupRequest>,
) -> Result<AxumJson<AuthMfaSetupResponse>, AppError> {
    Ok(AxumJson(state.auth_nats.setup_totp(body).await?))
}

