use std::sync::Arc;

use axum::{
    extract::{Json, Extension},
    routing::post,
    Json as AxumJson,
    Router,
};
use serde::{Deserialize, Serialize};

use crate::{error::AppError, identity::Identity, state::AppState};

pub fn router() -> Router {
    Router::new()
        .route("/order", post(place_order))
}

#[derive(Deserialize, Serialize)]
pub struct PlaceOrderRequest {
    pub symbol: String,
    pub qty: f64,
    pub side: String,
}

#[derive(Deserialize, Serialize)]
pub struct PlaceOrderResponse {
    pub order_id: String,
    pub status: String,
}

#[tracing::instrument(
    name = "trading_place_order",
    skip(state, identity, req),
    fields(user_id = %identity.user_id)
)]
pub async fn place_order(
    identity: Identity,
    Extension(state): Extension<Arc<AppState>>,
    Json(req): Json<PlaceOrderRequest>,
) -> Result<AxumJson<PlaceOrderResponse>, AppError> {
    let res: PlaceOrderResponse = state
        .nats
        .rpc("trading.order.place", &req)
        .await?;

    Ok(AxumJson(res))
}

async fn health() -> &'static str {
    "OK"
}

