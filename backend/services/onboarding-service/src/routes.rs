use axum::{Json, extract::State};
use serde_json::json;

pub async fn health() -> &'static str {
    "OK"
}

pub async fn start_onboarding() -> Json<serde_json::Value> {
    Json(json!({
        "message": "onboarding started",
        "status": "pending"
    }))
}

