use std::sync::Arc;
use axum::{
    extract::Json,
    routing::post,
    Json as AxumJson,
    Router,
    Extension,
};
use serde::{Deserialize, Serialize};
use crate::{error::AppError, identity::Identity, state::AppState};

pub fn router() -> Router {
    Router::new()
        .route("/order", post(place_order))
}

#[derive(Deserialize, Serialize)]
pub struct TradingOrderRequest {
    pub symbol: String,
    pub qty: f64,
    pub side: String,
}

#[derive(Deserialize, Serialize)]
pub struct TradingOrderResponse {
    pub order_id: String,
    pub status: String,
}

#[tracing::instrument(
    name = "trading_place_order",
    skip(state, identity, req),
    fields(user_id = %identity.user_id)
)]
pub async fn place_order(
    Extension(state): Extension<Arc<AppState>>,
    identity: Identity,
    Json(req): Json<TradingOrderRequest>,
) -> Result<AxumJson<TradingOrderResponse>, AppError> {
    let res: TradingOrderResponse = state
        .nats
        .rpc("trading.order.place", &req)
        .await?;

    Ok(AxumJson(res))
}

