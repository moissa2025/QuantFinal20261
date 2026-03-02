use std::sync::Arc;

use axum::{
    extract::Extension,
    http::StatusCode,
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};

use crate::{identity::Identity, state::AppState};

#[derive(Serialize, Deserialize)]
pub struct Position {
    pub symbol: String,
    pub qty: f64,
    pub avg_price: f64,
}

pub fn router() -> Router {
    Router::new().route("/v1/positions", get(list))
}

async fn list(
    Extension(state): Extension<Arc<AppState>>,
    Extension(identity): Extension<Identity>,
) -> Result<Json<Vec<Position>>, StatusCode> {
    let msg = state
        .nats
        .request("positions.list", identity.user_id.clone().into())
        .await
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    let resp: Vec<Position> = serde_json::from_slice(&msg.payload)
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    Ok(Json(resp))
}

