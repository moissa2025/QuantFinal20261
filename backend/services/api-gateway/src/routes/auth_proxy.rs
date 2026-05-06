use std::sync::Arc;

use axum::{
    extract::{State, Path},
    http::{Request, StatusCode},
    response::IntoResponse,
    routing::get,
    body::Body,
    Router,
};
use hyper::body::to_bytes;
use reqwest::Client;

use crate::state::AppState;

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/*path", axum::routing::any(proxy_auth))
}

pub async fn proxy_auth(
    State(_state): State<Arc<AppState>>,
    Path(path): Path<String>,
    req: Request<Body>,
) -> impl IntoResponse {
    let client = Client::new();

    let axum_method = req.method().clone();
    let axum_headers = req.headers().clone();

    let body_bytes = match to_bytes(req.into_body()).await {
        Ok(bytes) => bytes,
        Err(_) => return (StatusCode::BAD_REQUEST, "invalid request body").into_response(),
    };

    let method = match reqwest::Method::from_bytes(axum_method.as_str().as_bytes()) {
        Ok(m) => m,
        Err(_) => return (StatusCode::BAD_REQUEST, "unsupported HTTP method").into_response(),
    };

    let url = format!("http://auth-service:9001/v1/auth/{}", path);

    let mut builder = client.request(method, &url);

    for (name, value) in axum_headers.iter() {
        if name.as_str().eq_ignore_ascii_case("host") {
            continue;
        }

        let header_name = match reqwest::header::HeaderName::from_bytes(name.as_str().as_bytes()) {
            Ok(n) => n,
            Err(_) => continue,
        };

        let header_value = match reqwest::header::HeaderValue::from_bytes(value.as_bytes()) {
            Ok(v) => v,
            Err(_) => continue,
        };

        builder = builder.header(header_name, header_value);
    }

    let resp = builder.body(body_bytes).send().await;

    match resp {
        Ok(r) => {
            let status = StatusCode::from_u16(r.status().as_u16())
                .unwrap_or(StatusCode::BAD_GATEWAY);
            let bytes = r.bytes().await.unwrap_or_default();
            (status, bytes).into_response()
        }
        Err(e) => {
            tracing::error!("auth proxy error: {}", e);
            (StatusCode::BAD_GATEWAY, "auth-service unreachable").into_response()
        }
    }
}

