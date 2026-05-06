use std::sync::Arc;

use axum::{
    extract::State,
    http::{HeaderMap, Request, StatusCode},
    middleware::Next,
    response::Response,
};
use cookie::Cookie;

use crate::{identity::Identity, state::AppState};

pub async fn auth_middleware<B>(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    mut req: Request<B>,
    next: Next<B>,
) -> Result<Response, StatusCode>
where
    B: Send + 'static,
{
    let path = req.uri().path();

    // -----------------------------------------
    // BYPASS HEALTH ENDPOINTS (public)
    // -----------------------------------------
    if path.ends_with("/health") {
        return Ok(next.run(req).await);
    }

    // -----------------------------------------
    // BYPASS AUTH ROUTES (login, logout, refresh)
    // -----------------------------------------
    if path.starts_with("/auth") || path.starts_with("/v1/auth") {
        return Ok(next.run(req).await);
    }

    // -----------------------------------------
    // REQUIRE SESSION COOKIE
    // -----------------------------------------
    let cookie_header = headers
        .get("cookie")
        .and_then(|v| v.to_str().ok())
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let cookies = Cookie::split_parse(cookie_header);
    let mut session_token = None;

    for c in cookies {
        let c = c.map_err(|_| StatusCode::UNAUTHORIZED)?;
        if c.name() == "session_token" {
            session_token = Some(c.value().to_string());
            break;
        }
    }

    let token = session_token.ok_or(StatusCode::UNAUTHORIZED)?;

    // -----------------------------------------
    // VALIDATE SESSION WITH AUTH SERVICE
    // -----------------------------------------
    let res = state
        .auth_nats
        .validate_session(token)
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    if !res.valid {
        return Err(StatusCode::UNAUTHORIZED);
    }

    // -----------------------------------------
    // INJECT IDENTITY INTO REQUEST
    // -----------------------------------------
    req.extensions_mut().insert(Identity {
        user_id: res.user_id,
        roles: res.roles,
    });

    // -----------------------------------------
    // CONTINUE PIPELINE
    // -----------------------------------------
    Ok(next.run(req).await)
}

