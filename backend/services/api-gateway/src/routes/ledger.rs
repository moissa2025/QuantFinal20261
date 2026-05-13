use std::sync::Arc;
use axum::{
    routing::get,
    Json, Router, Extension,
};
use serde::{Deserialize, Serialize};
use crate::{error::AppError, identity::Identity, state::AppState};

pub fn router() -> Router {
    Router::new()
        .route("/balance", get(get_balance))
}

#[derive(Serialize, Deserialize)]
pub struct BalanceResponse {
    pub balance: f64,
}

#[tracing::instrument(
    name = "get_ledger_balance",
    skip(state, identity),
    fields(user_id = %identity.user_id)
)]
pub async fn get_balance(
    Extension(state): Extension<Arc<AppState>>,
    identity: Identity,
) -> Result<Json<BalanceResponse>, AppError> {
    let res: BalanceResponse = state
        .nats
        .rpc("ledger.balance.get", &identity.user_id)
        .await?;

    Ok(Json(res))
}

