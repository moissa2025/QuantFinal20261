use axum::{Router, routing::get, Json};
use serde_json::json;

pub fn routes() -> Router {
    Router::new().route("/health", get(health))
}

async fn health() -> Json<serde_json::Value> {
    Json(json!({
        "service": "api-gateway",
        "status": "ok"
    }))
}

