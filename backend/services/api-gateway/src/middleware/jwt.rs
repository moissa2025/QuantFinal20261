use axum::{
    body::Body,
    http::{Request, StatusCode},
    middleware::Next,
    response::{IntoResponse, Response},
};
use jsonwebtoken::{decode, DecodingKey, Validation, Algorithm};
use serde::Deserialize;

use crate::identity::Identity;

#[derive(Debug, Deserialize)]
struct Claims {
    sub: String,
    email: Option<String>,
    exp: usize,
}

pub async fn jwt_middleware(
    mut req: Request<Body>,
    next: Next<Body>,
) -> Response {
    let Some(auth_header) = req.headers().get("Authorization") else {
        return (StatusCode::UNAUTHORIZED, "Missing Authorization header").into_response();
    };

    let auth_str = match auth_header.to_str() {
        Ok(v) => v,
        Err(_) => return (StatusCode::BAD_REQUEST, "Invalid Authorization header").into_response(),
    };

    if !auth_str.starts_with("Bearer ") {
        return (StatusCode::UNAUTHORIZED, "Expected Bearer token").into_response();
    }

    let token = &auth_str[7..];

    let state = req
        .extensions()
        .get::<crate::state::AppState>()
        .expect("AppState missing");

    let key = DecodingKey::from_secret(state.jwt_secret.as_bytes());

    let token_data = match decode::<Claims>(
        token,
        &key,
        &Validation::new(Algorithm::HS256),
    ) {
        Ok(c) => c,
        Err(_) => return (StatusCode::UNAUTHORIZED, "Invalid or expired token").into_response(),
    };

    let claims = token_data.claims;

    req.extensions_mut().insert(Identity {
        user_id: claims.sub,
        email: claims.email.unwrap_or_default(),
    });

    next.run(req).await
}

