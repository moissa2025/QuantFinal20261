use std::sync::Arc;

use axum::{
    extract::State,
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};

use crate::{error::AppError, identity::Identity, state::AppState};

pub fn router() -> Router {
    Router::new()
        .route("/limits", get(get_limits))
}

#[derive(Serialize, Deserialize)]
pub struct RiskLimits {
    pub max_position: f64,
    pub max_order_size: f64,
}

#[tracing::instrument(
    name = "get_risk_limits",
    skip(state, identity),
    fields(user_id = %identity.user_id)
)]
pub async fn get_limits(
    identity: Identity,
    State(state): State<Arc<AppState>>,
) -> Result<Json<RiskLimits>, AppError> {
    let res: RiskLimits = state
        .nats
        .rpc("risk.limits.get", &identity.user_id)
        .await?;

    Ok(Json(res))
}

async fn health() -> &'static str {
    "OK"
}

