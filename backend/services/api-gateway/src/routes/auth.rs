use std::sync::Arc;

use axum::{
    extract::State,
    Json,
    http::{StatusCode, header},
    response::{IntoResponse, Response},
    TypedHeader,
};
use axum_extra::headers::Cookie;
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::state::AppState;

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub user_id: String,
    pub roles: Vec<String>,
}

pub async fn login_handler(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<LoginRequest>,
) -> Result<Response, StatusCode> {
    let auth_res = state
        .auth_nats
        .login(payload.email, payload.password)
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    let cookie = format!(
        "session_token={}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age={}",
        auth_res.session_token,
        auth_res.ttl_seconds
    );

    let body = Json(LoginResponse {
        user_id: auth_res.user_id,
        roles: auth_res.roles,
    });

    Ok(([(header::SET_COOKIE, cookie)], body).into_response())
}

pub async fn logout_handler(
    State(state): State<Arc<AppState>>,
    TypedHeader(cookies): TypedHeader<Cookie>,
) -> impl IntoResponse {
    if let Some(token) = cookies.get("session_token") {
        let _ = state.auth_nats.logout(token.to_string()).await;
    }

    let clear_cookie = "session_token=deleted; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0";

    (
        [(header::SET_COOKIE, clear_cookie)],
        Json(json!({ "status": "ok" })),
    )
}

