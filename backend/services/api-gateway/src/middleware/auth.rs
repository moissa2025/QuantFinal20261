use std::sync::Arc;

use axum::{
    body::Body,
    extract::State,
    http::{Request, StatusCode},
    middleware::Next,
    response::Response,
    TypedHeader,
};
use axum_extra::headers::Cookie;

use crate::{identity::Identity, state::AppState};

pub async fn auth_middleware(
    State(state): State<Arc<AppState>>,
    TypedHeader(cookies): TypedHeader<Cookie>,
    mut req: Request<Body>,
    next: Next<Body>,
) -> Result<Response, StatusCode> {
    // 1. Extract session token from cookie
    let token = cookies
        .get("session_token")
        .ok_or(StatusCode::UNAUTHORIZED)?;

    // 2. Validate session via NATS RPC
    let res = state
        .auth_nats
        .validate_session(token.to_string())
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    if !res.valid {
        return Err(StatusCode::UNAUTHORIZED);
    }

    // 3. Inject identity into request extensions
    req.extensions_mut().insert(Identity {
        user_id: res.user_id,
        roles: res.roles,
    });

    // 4. Continue to next handler
    Ok(next.run(req).await)
}

