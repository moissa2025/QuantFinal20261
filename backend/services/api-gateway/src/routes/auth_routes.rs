use axum::{
    routing::{get, post},
    Router,
    extract::{State, Json},
};
use std::sync::Arc;

use crate::state::AppState;

// REAL DTOs from common crate
use common::auth_messages::{
    RegisterRequest,
    RegisterResponse,
    ActivateResponse,
    AuthLoginRequest,
    AuthLoginResponse,
    AuthLogoutRequest,
    AuthValidateSessionRequest,
    AuthValidateSessionResponse,
    AuthRefreshRequest,
    AuthRefreshResponse,
    AuthMfaVerifyRequest,
    AuthMfaVerifyResponse,
};

// Local struct because common crate does NOT define ActivateRequest
#[derive(serde::Deserialize)]
pub struct ActivateRequest {
    pub token: String,
}

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/register", post(register))
        .route("/activate", post(activate))
        .route("/login", post(login))
        .route("/logout", post(logout))
        .route("/mfa/verify", post(verify_mfa))
        .route("/session", get(session))
        .route("/refresh", post(refresh))
}

/* ---------------------------
   HANDLERS
---------------------------- */

async fn register(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<RegisterRequest>,
) -> Json<RegisterResponse> {
    let res = state.auth_nats.register(payload).await.unwrap();
    Json(res)
}

async fn activate(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<ActivateRequest>,
) -> Json<ActivateResponse> {
    let res = state.auth_nats.activate(payload.token).await.unwrap();
    Json(res)
}

async fn login(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<AuthLoginRequest>,
) -> Json<AuthLoginResponse> {
    let res = state
        .auth_nats
        .login(payload.email, payload.password)
        .await
        .unwrap();

    Json(res)
}

async fn logout(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<AuthLogoutRequest>,
) -> Json<()> {
    state.auth_nats.logout(payload.session_token).await.unwrap();
    Json(())
}

async fn verify_mfa(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<AuthMfaVerifyRequest>,
) -> Json<AuthMfaVerifyResponse> {
    let res = state.auth_nats.verify_mfa(payload).await.unwrap();
    Json(res)
}

async fn session(
    State(state): State<Arc<AppState>>,
) -> Json<AuthValidateSessionResponse> {
    // TODO: extract session token from cookie/header
    let dummy_token = "".to_string();

    let res = state
        .auth_nats
        .validate_session(dummy_token)
        .await
        .unwrap();

    Json(res)
}

async fn refresh(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<AuthRefreshRequest>,
) -> Json<AuthRefreshResponse> {
    let res = state.auth_nats.refresh(payload).await.unwrap();
    Json(res)
}

