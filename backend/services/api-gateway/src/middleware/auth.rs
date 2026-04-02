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

    let res = state
        .auth_nats
        .validate_session(token)
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

