use std::sync::Arc;

use axum::{
    body::Body,
    extract::State,
    http::{Request, StatusCode},
    middleware::Next,
    response::Response,
};
use axum_extra::TypedHeader;
use axum_extra::headers::Cookie;

use crate::{identity::Identity, state::AppState};

pub async fn auth_middleware(
    State(state): State<Arc<AppState>>,
    TypedHeader(cookies): TypedHeader<Cookie>,
    mut req: Request<Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    let token = cookies
        .get("session_token")
        .ok_or(StatusCode::UNAUTHORIZED)?;

    let res = state
        .auth_nats
        .validate_session(token.to_string())
        .await
        .map_err(|_| StatusCode::UNAUTHORIZED)?;

    if !res.valid {
        return Err(StatusCode::UNAUTHORIZED);
    }

    req.extensions_mut().insert(Identity {
        user_id: res.user_id,
        roles: res.roles,
    });

    Ok(next.run(req).await)
}

