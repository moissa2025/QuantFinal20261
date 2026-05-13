use std::sync::Arc;
use axum::{
    routing::get,
    Json, Router, Extension,
};
use crate::{error::AppError, identity::Identity, state::AppState};

#[derive(serde::Serialize, serde::Deserialize)]
pub struct BalancesResponse {
    pub cash: f64,
    pub margin: f64,
}

pub fn router() -> Router {
    Router::new().route("/", get(get_balances))
}

pub async fn get_balances(
    Extension(state): Extension<Arc<AppState>>,
    identity: Identity,
) -> Result<Json<BalancesResponse>, AppError> {
    let res: BalancesResponse = state
        .nats
        .rpc("ledger.balances.get", &identity.user_id)
        .await?;

    Ok(Json(res))
}

