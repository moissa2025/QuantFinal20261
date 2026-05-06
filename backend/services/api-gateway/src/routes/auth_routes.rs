use axum::{
    routing::post,
    Router,
    extract::{State, Json},
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use std::sync::Arc;

use crate::state::AppState;

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/login", post(login))
        .route("/logout", post(logout))
}

#[derive(Deserialize, ToSchema)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, ToSchema)]
pub struct LoginResponse {
    pub user_id: String,
    pub roles: Vec<String>,
    pub session_token: String,
}

async fn login(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<LoginRequest>,
) -> Json<LoginResponse> {
    let res = state
        .auth_nats
        .login(payload.email, payload.password)
        .await
        .unwrap();

    Json(LoginResponse {
        user_id: res.user_id,
        roles: res.roles,
        session_token: res.session_token,
    })
}

#[derive(Deserialize, ToSchema)]
pub struct LogoutRequest {
    pub session_token: String,
}

#[derive(Serialize, ToSchema)]
pub struct LogoutResponse {
    pub status: String,
}

async fn logout(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<LogoutRequest>,
) -> Json<LogoutResponse> {
    state
        .auth_nats
        .logout(payload.session_token)
        .await
        .unwrap();

    Json(LogoutResponse {
        status: "ok".to_string(),
    })
}

