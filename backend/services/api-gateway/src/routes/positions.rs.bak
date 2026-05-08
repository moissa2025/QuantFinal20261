use std::sync::Arc;

use axum::{
    extract::{Path, State},
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};

use crate::{error::AppError, identity::Identity, state::AppState};

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/", get(list_positions))
        .route("/:symbol", get(get_position))
}

#[derive(Serialize, Deserialize)]
pub struct Position {
    pub symbol: String,
    pub qty: f64,
    pub avg_price: f64,
    pub unrealized_pnl: f64,
}

#[tracing::instrument(
    name = "list_positions",
    skip(state, identity),
    fields(user_id = %identity.user_id)
)]
pub async fn list_positions(
    identity: Identity,
    State(state): State<Arc<AppState>>,
) -> Result<Json<Vec<Position>>, AppError> {
    let res: Vec<Position> = state
        .nats
        .rpc("trading.position.list", &identity.user_id)
        .await?;

    Ok(Json(res))
}

#[tracing::instrument(
    name = "get_position",
    skip(state, identity),
    fields(user_id = %identity.user_id, symbol = %symbol)
)]
pub async fn get_position(
    identity: Identity,
    State(state): State<Arc<AppState>>,
    Path(symbol): Path<String>,
) -> Result<Json<Position>, AppError> {
    let req = (identity.user_id.clone(), symbol);

    let res: Position = state
        .nats
        .rpc("trading.position.get", &req)
        .await?;

    Ok(Json(res))
}

async fn health() -> &'static str {
    "OK"
}

