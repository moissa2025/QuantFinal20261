use axum::{Json, extract::{Path, State}};
use serde_json::json;
use std::sync::Arc;
use crate::state::AppState;

pub async fn health() -> &'static str {
    "OK"
}

pub async fn create_account(
    State(state): State<Arc<AppState>>,
) -> Json<serde_json::Value> {
    // placeholder
    Json(json!({"status": "account created"}))
}

pub async fn get_balance(
    State(state): State<Arc<AppState>>,
    Path(id): Path<i64>,
) -> Json<serde_json::Value> {
    Json(json!({"id": id, "balance": 0}))
}

