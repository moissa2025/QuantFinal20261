use std::sync::Arc;

use axum::{
    extract::{Path, State},
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};

use crate::{error::AppError, identity::Identity, state::AppState};

pub fn router() -> Router<Arc<AppState>> {
    Router::new().route("/ticker/:symbol", get(get_ticker))
}

#[derive(Serialize, Deserialize)]
pub struct TickerRequest {
    pub symbol: String,
}

#[derive(Serialize, Deserialize)]
pub struct TickerResponse {
    pub symbol: String,
    pub price: f64,
}

#[tracing::instrument(
    name = "get_ticker",
    skip(state, identity),
    fields(user_id = %identity.user_id, symbol = %symbol)
)]
pub async fn get_ticker(
    identity: Identity,
    State(state): State<Arc<AppState>>,
    Path(symbol): Path<String>,
) -> Result<Json<TickerResponse>, AppError> {
    let req = TickerRequest { symbol };

    let res: TickerResponse = state
        .nats
        .rpc("market.ticker.get", &req)
        .await?;

    Ok(Json(res))
}

