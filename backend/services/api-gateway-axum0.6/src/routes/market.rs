use std::sync::Arc;

use axum::{
    extract::{Extension, Path},
    http::StatusCode,
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};

use crate::state::AppState;

#[derive(Serialize, Deserialize)]
pub struct TickerRequest {
    pub symbol: String,
}

#[derive(Serialize, Deserialize)]
pub struct TickerResponse {
    pub symbol: String,
    pub price: f64,
}

pub fn router() -> Router {
    Router::new().route("/v1/market/ticker/:symbol", get(ticker))
}

async fn ticker(
    Path(symbol): Path<String>,
    Extension(state): Extension<Arc<AppState>>,
) -> Result<Json<TickerResponse>, StatusCode> {
    let payload = serde_json::to_vec(&TickerRequest { symbol })
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let msg = state
        .nats
        .request("market.ticker.get", payload.into())
        .await
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    let resp: TickerResponse = serde_json::from_slice(&msg.payload)
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    Ok(Json(resp))
}

