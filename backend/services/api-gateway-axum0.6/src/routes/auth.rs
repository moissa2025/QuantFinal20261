use std::sync::Arc;

use axum::{
    extract::Extension,
    http::StatusCode,
    routing::post,
    Json, Router,
};
use serde::{Deserialize, Serialize};

use crate::{auth_client::LoginResponse, state::AppState};

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponseDto {
    pub token: String,
}

pub fn router() -> Router {
    Router::new()
        .route("/v1/auth/login", post(login))
        .route("/v1/auth/register", post(register))
}

async fn login(
    Extension(state): Extension<Arc<AppState>>,
    Json(body): Json<LoginRequest>,
) -> Result<Json<LoginResponseDto>, StatusCode> {
    let resp: LoginResponse = state
        .auth
        .login(body.email, body.password)
        .await
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    Ok(Json(LoginResponseDto { token: resp.token }))
}

async fn register(
    Extension(state): Extension<Arc<AppState>>,
    Json(body): Json<LoginRequest>,
) -> Result<StatusCode, StatusCode> {
    state
        .auth
        .register(body.email, body.password)
        .await
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    Ok(StatusCode::CREATED)
}

