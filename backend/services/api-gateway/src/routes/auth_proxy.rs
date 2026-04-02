use std::sync::Arc;

use axum::{
    extract::{State, Path},
    http::{Request, StatusCode},
    response::IntoResponse,
    body::Body,
};
use hyper::body::to_bytes;
use reqwest::Client;

use crate::state::AppState;

pub async fn proxy_auth(
    State(_state): State<Arc<AppState>>,
    Path(path): Path<String>,
    req: Request<Body>,
) -> impl IntoResponse {
    let client = Client::new();

    //
    // 1. Extract method + headers BEFORE consuming the body
    //
    let axum_method = req.method().clone();
    let axum_headers = req.headers().clone();

    //
    // 2. Extract body bytes using hyper::body::to_bytes
    //
    let body_bytes = match to_bytes(req.into_body()).await {
        Ok(bytes) => bytes,
        Err(_) => {
            return (
                StatusCode::BAD_REQUEST,
                "invalid request body",
            )
                .into_response();
        }
    };

    //
    // 3. Convert Axum method → Reqwest method
    //
    let method = match reqwest::Method::from_bytes(axum_method.as_str().as_bytes()) {
        Ok(m) => m,
        Err(_) => {
            return (
                StatusCode::BAD_REQUEST,
                "unsupported HTTP method",
            )
                .into_response();
        }
    };

    //
    // 4. Build target URL
    //
    let url = format!("http://auth-service:8080/v1/auth/{}", path);

    //
    // 5. Build outgoing request
    //
    let mut builder = client.request(method, &url);

    //
    // 6. Forward headers (convert Axum → Reqwest)
    //
    for (name, value) in axum_headers.iter() {
        if name.as_str().eq_ignore_ascii_case("host") {
            continue;
        }

        let header_name =
            match reqwest::header::HeaderName::from_bytes(name.as_str().as_bytes()) {
                Ok(n) => n,
                Err(_) => continue,
            };

        let header_value =
            match reqwest::header::HeaderValue::from_bytes(value.as_bytes()) {
                Ok(v) => v,
                Err(_) => continue,
            };

        builder = builder.header(header_name, header_value);
    }

    //
    // 7. Send request
    //
    let resp = builder.body(body_bytes).send().await;

    //
    // 8. Convert response back to Axum response
    //
    match resp {
        Ok(r) => {
            let status = StatusCode::from_u16(r.status().as_u16())
                .unwrap_or(StatusCode::BAD_GATEWAY);

            let bytes = r.bytes().await.unwrap_or_default();

            (status, bytes).into_response()
        }

        Err(e) => {
            tracing::error!("auth proxy error: {}", e);
            (
                StatusCode::BAD_GATEWAY,
                "auth-service unreachable",
            )
                .into_response()
        }
    }
}

