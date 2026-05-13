use std::sync::Arc;
use axum::{
    body::Body,
    extract::Path,
    http::{Request, StatusCode},
    response::IntoResponse,
    Router,
};
use hyper::body::to_bytes;
use reqwest::Client;
use crate::state::AppState;
use axum::Extension;

pub fn router() -> Router {
    Router::new().route("/*path", axum::routing::any(proxy_auth))
}

pub async fn proxy_auth(
    Extension(_state): Extension<Arc<AppState>>,
    Path(path): Path<String>,
    req: Request<Body>,
) -> impl IntoResponse {
    let client = Client::new();

    let method = req.method().clone();
    let headers = req.headers().clone();

    let body_bytes = match to_bytes(req.into_body()).await {
        Ok(bytes) => bytes,
        Err(_) => return (StatusCode::BAD_REQUEST, "invalid body").into_response(),
    };

    let method = match reqwest::Method::from_bytes(method.as_str().as_bytes()) {
        Ok(m) => m,
        Err(_) => return (StatusCode::BAD_REQUEST, "unsupported method").into_response(),
    };

    let url = format!("http://auth-service:9001/v1/auth/{}", path);

    let mut builder = client.request(method, &url);

    for (name, value) in headers.iter() {
        if name.as_str().eq_ignore_ascii_case("host") {
            continue;
        }

        if let (Ok(hn), Ok(hv)) = (
            reqwest::header::HeaderName::from_bytes(name.as_str().as_bytes()),
            reqwest::header::HeaderValue::from_bytes(value.as_bytes()),
        ) {
            builder = builder.header(hn, hv);
        }
    }

    match builder.body(body_bytes).send().await {
        Ok(resp) => {
            let status = StatusCode::from_u16(resp.status().as_u16())
                .unwrap_or(StatusCode::BAD_GATEWAY);
            let bytes = resp.bytes().await.unwrap_or_default();
            (status, bytes).into_response()
        }
        Err(_) => (StatusCode::BAD_GATEWAY, "auth-service unreachable").into_response(),
    }
}

