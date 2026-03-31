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

    // 1. Extract method + headers BEFORE consuming the body
    let method = req.method().clone();
    let headers = req.headers().clone();

    // 2. Extract body (this consumes req)
    let body_bytes = to_bytes(req.into_body(), usize::MAX)
        .await
        .unwrap_or_default();

    // 3. Build target URL
    let url = format!(
        "http://auth-service:8080/v1/auth/{}",
        path
    );

    // 4. Build outgoing request
    let mut builder = client.request(method, &url);

    // 5. Forward headers
    for (name, value) in headers.iter() {
        // Skip hop-by-hop headers
        if name.as_str().eq_ignore_ascii_case("host") {
            continue;
        }
        builder = builder.header(name, value);
    }

    // 6. Send request
    let resp = builder
        .body(body_bytes)
        .send()
        .await;

    // 7. Return response to client
    match resp {
        Ok(r) => {
            let status = r.status();
            let bytes = r.bytes().await.unwrap_or_default();
            (status, bytes).into_response()
        }
        Err(e) => {
            tracing::error!("auth proxy error: {}", e);
            (
                StatusCode::BAD_GATEWAY,
                "auth-service unreachable"
            ).into_response()
        }
    }
}

