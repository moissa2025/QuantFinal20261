use axum::{Json, extract::State};
use serde_json::json;
use sqlx::PgPool;

pub async fn health() -> &'static str {
    "OK"
}

pub async fn get_kyc_status(
    State(_db): State<PgPool>
) -> Json<serde_json::Value> {
    Json(json!({ "status": "pending" }))
}

