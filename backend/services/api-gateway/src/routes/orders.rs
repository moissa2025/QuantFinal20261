use std::sync::Arc;
use axum::{
    extract::{Path, Json},
    routing::{get, post},
    Json as AxumJson,
    Router,
    Extension,
};
use serde::{Deserialize, Serialize};
use crate::{error::AppError, identity::Identity, state::AppState};

pub fn router() -> Router {
    Router::new()
        .route("/", post(place_order))
        .route("/:order_id", get(get_order))
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
    name = "place_order",
    skip(state, identity, req),
    fields(user_id = %identity.user_id)
)]
pub async fn place_order(
    Extension(state): Extension<Arc<AppState>>,
    identity: Identity,
    Json(req): Json<PlaceOrderRequest>,
) -> Result<AxumJson<PlaceOrderResponse>, AppError> {
    let res: PlaceOrderResponse = state
        .nats
        .rpc("trading.order.place", &req)
        .await?;

    Ok(AxumJson(res))
}

#[derive(Deserialize, Serialize)]
pub struct GetOrderResponse {
    pub order_id: String,
    pub symbol: String,
    pub qty: f64,
    pub side: String,
    pub status: String,
}

#[tracing::instrument(
    name = "get_order",
    skip(state, identity),
    fields(user_id = %identity.user_id, order_id = %order_id)
)]
pub async fn get_order(
    Extension(state): Extension<Arc<AppState>>,
    identity: Identity,
    Path(order_id): Path<String>,
) -> Result<AxumJson<GetOrderResponse>, AppError> {
    let res: GetOrderResponse = state
        .nats
        .rpc("trading.order.get", &order_id)
        .await?;

    Ok(AxumJson(res))
}

