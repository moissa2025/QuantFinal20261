use axum::{
    extract::{State, TypedHeader},
    routing::{post},
    Json, Router,
};
use headers::UserAgent;
use http::HeaderMap;
use serde::Deserialize;

use crate::state::AppState;
use crate::auth_client_nats::AuthNatsClient;

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

//
// Helpers
//
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

//
// Request bodies
//
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

//
// Router
//
pub fn router() -> Router<AppState> {
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

//
// Handlers
//

async fn register(
    State(state): State<AppState>,
    Json(body): Json<RegisterRequest>,
) -> Result<Json<RegisterResponse>, String> {
    state.auth_nats
        .register(body)
        .await
        .map(Json)
        .map_err(|e| e.to_string())
}

async fn activate(
    State(state): State<AppState>,
    Json(body): Json<ActivateBody>,
) -> Result<Json<ActivateResponse>, String> {
    state.auth_nats
        .activate(body.token)
        .await
        .map(Json)
        .map_err(|e| e.to_string())
}

async fn login(
    State(state): State<AppState>,
    headers: HeaderMap,
    ua: Option<TypedHeader<UserAgent>>,
    Json(body): Json<LoginBody>,
) -> Result<Json<AuthLoginResponse>, String> {
    let ip = extract_ip(&headers);
    let ua_str = extract_ua(ua);

    state.auth_nats
        .login(body.email, body.password, ip, ua_str)
        .await
        .map(Json)
        .map_err(|e| e.to_string())
}

async fn refresh(
    State(state): State<AppState>,
    headers: HeaderMap,
    ua: Option<TypedHeader<UserAgent>>,
    Json(body): Json<RefreshBody>,
) -> Result<Json<AuthRefreshResponse>, String> {
    let ip = extract_ip(&headers);
    let ua_str = extract_ua(ua);

    state.auth_nats
        .refresh(body.refresh_token, ip, ua_str)
        .await
        .map(Json)
        .map_err(|e| e.to_string())
}

async fn validate_session(
    State(state): State<AppState>,
    headers: HeaderMap,
    ua: Option<TypedHeader<UserAgent>>,
    Json(body): Json<ValidateBody>,
) -> Result<Json<AuthValidateSessionResponse>, String> {
    let ip = extract_ip(&headers);
    let ua_str = extract_ua(ua);

    state.auth_nats
        .validate_session(body.session_token, ip, ua_str)
        .await
        .map(Json)
        .map_err(|e| e.to_string())
}

async fn logout(
    State(state): State<AppState>,
    Json(body): Json<LogoutBody>,
) -> Result<(), String> {
    state.auth_nats
        .logout(body.session_token)
        .await
        .map_err(|e| e.to_string())
}

async fn verify_mfa(
    State(state): State<AppState>,
    Json(body): Json<AuthMfaVerifyRequest>,
) -> Result<Json<AuthMfaVerifyResponse>, String> {
    state.auth_nats
        .verify_mfa(body)
        .await
        .map(Json)
        .map_err(|e| e.to_string())
}

async fn setup_totp(
    State(state): State<AppState>,
    Json(body): Json<AuthMfaSetupRequest>,
) -> Result<Json<AuthMfaSetupResponse>, String> {
    state.auth_nats
        .setup_totp(body)
        .await
        .map(Json)
        .map_err(|e| e.to_string())
}

