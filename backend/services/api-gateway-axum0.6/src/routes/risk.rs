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
pub struct RiskMetrics {
    pub var_95: f64,
    pub var_99: f64,
}

pub fn router() -> Router {
    Router::new().route("/v1/risk/metrics", get(metrics))
}

async fn metrics(
    Extension(state): Extension<Arc<AppState>>,
    Extension(identity): Extension<Identity>,
) -> Result<Json<RiskMetrics>, StatusCode> {
    let msg = state
        .nats
        .request("risk.metrics.get", identity.user_id.clone().into())
        .await
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    let resp: RiskMetrics = serde_json::from_slice(&msg.payload)
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    Ok(Json(resp))
}

