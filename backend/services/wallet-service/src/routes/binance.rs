use axum::{Router, routing::get, extract::State, Json};
use serde_json::json;
use std::sync::Arc;
use crate::state::AppState;

pub async fn binance_ping_handler(
    State(state): State<Arc<AppState>>,
) -> Json<serde_json::Value> {
    match state.binance_client.ping().await {
        Ok(_) => Json(json!({ "status": "ok" })),
        Err(e) => Json(json!({
            "status": "error",
            "message": format!("{:?}", e)
        })),
    }
}

pub fn routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/binance/ping", get(binance_ping_handler))
}

