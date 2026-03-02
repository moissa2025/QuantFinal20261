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
pub struct BalancesResponse {
    pub cash: f64,
    pub margin: f64,
}

pub fn router() -> Router {
    Router::new().route("/v1/balances", get(balances))
}

async fn balances(
    Extension(state): Extension<Arc<AppState>>,
    Extension(identity): Extension<Identity>,
) -> Result<Json<BalancesResponse>, StatusCode> {
    let msg = state
        .nats
        .request("ledger.balances.get", identity.user_id.clone().into())
        .await
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    let resp: BalancesResponse = serde_json::from_slice(&msg.payload)
        .map_err(|_| StatusCode::BAD_GATEWAY)?;

    Ok(Json(resp))
}

