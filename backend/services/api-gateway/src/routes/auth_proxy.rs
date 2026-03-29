use axum::{
    extract::{State, Path},
    http::{Request, StatusCode},
    response::IntoResponse,
    body::{Body, to_bytes},
};
use reqwest::Client;
use std::sync::Arc;

use crate::state::AppState;

pub async fn proxy_auth(
    State(_state): State<Arc<AppState>>,
    Path(path): Path<String>,
    req: Request<Body>,
) -> impl IntoResponse {
    let client = Client::new();

    let url = format!(
        "http://auth-service:8080/{}",
        path
    );

    let method = req.method().clone();

    // Axum 0.7 requires a limit argument
    let body_bytes = to_bytes(req.into_body(), usize::MAX)
        .await
        .unwrap_or_default();

    let resp = client
        .request(method, &url)
        .body(body_bytes)
        .send()
        .await;

    match resp {
        Ok(r) => {
            let status = r.status();
            let bytes = r.bytes().await.unwrap_or_default();

            // Return a proper Axum response
            (status, bytes).into_response()
        }
        Err(e) => {
            tracing::error!("auth proxy error: {}", e);

            // Also return a proper Axum response
            (
                StatusCode::BAD_GATEWAY,
                "auth-service unreachable"
            ).into_response()
        }
    }
}

