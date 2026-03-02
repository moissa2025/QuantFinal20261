use std::sync::Arc;

use axum::{
    extract::State,
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};

use crate::{error::AppError, identity::Identity, state::AppState};

pub fn router() -> Router<Arc<AppState>> {
    Router::new().route("/balance", get(get_balance))
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
    identity: Identity,
    State(state): State<Arc<AppState>>,
) -> Result<Json<BalanceResponse>, AppError> {
    let res: BalanceResponse = state
        .nats
        .rpc("ledger.balance.get", &identity.user_id)
        .await?;

    Ok(Json(res))
}

