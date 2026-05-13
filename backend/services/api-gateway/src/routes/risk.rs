use std::sync::Arc;
use axum::{
    routing::get,
    Json, Router, Extension,
};
use serde::{Deserialize, Serialize};
use crate::{error::AppError, identity::Identity, state::AppState};

pub fn router() -> Router {
    Router::new()
        .route("/limits", get(get_limits))
}

#[derive(Serialize, Deserialize)]
pub struct RiskLimitsResponse {
    pub max_position: f64,
    pub max_leverage: f64,
}

#[tracing::instrument(
    name = "get_risk_limits",
    skip(state, identity),
    fields(user_id = %identity.user_id)
)]
pub async fn get_limits(
    Extension(state): Extension<Arc<AppState>>,
    identity: Identity,
) -> Result<Json<RiskLimitsResponse>, AppError> {
    let res: RiskLimitsResponse = state
        .nats
        .rpc("risk.limits.get", &identity.user_id)
        .await?;

    Ok(Json(res))
}

