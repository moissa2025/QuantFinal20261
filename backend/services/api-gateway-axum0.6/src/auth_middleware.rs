use std::sync::Arc;

use axum::{
    extract::Extension,
    http::{Request, StatusCode},
    middleware::Next,
    response::{IntoResponse, Response},
};

use crate::state::AppState;

pub async fn require_auth<B>(
    Extension(state): Extension<Arc<AppState>>,
    mut req: Request<B>,
    next: Next<B>,
) -> Response {
    // Extract token from Authorization header
    let token = req
        .headers()
        .get("authorization")
        .and_then(|v| v.to_str().ok());

    // Validate token via auth-service
    let identity = match token {
        Some(t) => match state.auth.validate_token(t).await {
            Ok(id) => id,
            Err(_) => return (StatusCode::UNAUTHORIZED, "unauthorized").into_response(),
        },
        None => return (StatusCode::UNAUTHORIZED, "unauthorized").into_response(),
    };

    // Insert identity into request extensions
    req.extensions_mut().insert(identity);

    // Continue to next handler
    next.run(req).await
}

