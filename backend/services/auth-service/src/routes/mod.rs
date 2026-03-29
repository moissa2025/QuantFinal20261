use axum::{
    routing::get,
    extract::State,
    Json, Router,
};
use serde_json::json;

use crate::state::AppState;

pub mod auth;

// ----------------------
// /live
// ----------------------
async fn live() -> Json<serde_json::Value> {
    Json(json!({"status": "live"}))
}

// ----------------------
// /health
// ----------------------
async fn health() -> Json<serde_json::Value> {
    Json(json!({"status": "ok"}))
}

// ----------------------
// /ready (DB + NATS)
// ----------------------
async fn ready(State(state): State<AppState>) -> Json<serde_json::Value> {
    // 1. Check DB
    if let Err(e) = sqlx::query("SELECT 1").execute(&state.db).await {
        return Json(json!({
            "status": "error",
            "db": e.to_string()
        }));
    }

    // 2. Check NATS
    if state.nats.connection_state() != async_nats::connection::State::Connected {
        return Json(json!({
            "status": "error",
            "nats": "not connected"
        }));
    }

    Json(json!({"status": "ready"}))
}

// ----------------------
// Router
// ----------------------
pub fn router() -> Router<AppState> {
    Router::<AppState>::new()
        .route("/live", get(live))
        .route("/health", get(health))
        .route("/ready", get(ready))
        .merge(auth::router())
}

