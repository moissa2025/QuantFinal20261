use common::auth_messages::AuthValidateSessionRequest;

use std::sync::Arc;

use axum::{
    body::Body,
    extract::State,
    http::{HeaderMap, Request, StatusCode},
    middleware::Next,
    response::Response,
};

use crate::{identity::Identity, state::AppState};

fn extract_ip(headers: &HeaderMap) -> String {
    headers
        .get("x-forwarded-for")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("0.0.0.0")
        .to_string()
}

fn extract_ua(headers: &HeaderMap) -> String {
    headers
        .get("user-agent")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("api-gateway")
        .to_string()
}

pub async fn auth_middleware(
    State(state): State<Arc<AppState>>,
    mut req: Request<Body>,
    next: Next<Body>,
) -> Result<Response, StatusCode> {
    let path = req.uri().path();

    // Public endpoints
    if path.ends_with("/health") {
        return Ok(next.run(req).await);
    }

    // Auth endpoints are public
    if path.starts_with("/auth") || path.starts_with("/v1/auth") {
        return Ok(next.run(req).await);
    }

    let headers = req.headers();
    let ip = extract_ip(headers);
    let ua = extract_ua(headers);

    // Extract Bearer token
    let token = headers
        .get("authorization")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.strip_prefix("Bearer "))
        .map(|s| s.to_string())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    // Validate session via NATS
    let res = state
        .auth_nats
        .validate_session(AuthValidateSessionRequest {
                          session_token: token.clone(),
                          ip_address: Some(ip),
                          user_agent: Some(ua),
                          })
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    if !res.valid {
        return Err(StatusCode::UNAUTHORIZED);
    }

    // Inject identity
    req.extensions_mut().insert(Identity {
    user_id: res.user_id,
    session_token: token,
    roles: Vec::new(),
});


    Ok(next.run(req).await)
}

