use std::sync::Arc;
use axum::{
    routing::get,
    Json, Router, Extension,
};
use serde::{Deserialize, Serialize};
use crate::{error::AppError, identity::Identity, state::AppState};

pub fn router() -> Router {
    Router::new()
        .route("/balance", get(get_wallet_balance))
}

#[derive(Serialize, Deserialize)]
pub struct WalletBalanceResponse {
    pub balance: f64,
}

#[tracing::instrument(
    name = "get_wallet_balance",
    skip(state, identity),
    fields(user_id = %identity.user_id)
)]
pub async fn get_wallet_balance(
    Extension(state): Extension<Arc<AppState>>,
    identity: Identity,
) -> Result<Json<WalletBalanceResponse>, AppError> {
    let res: WalletBalanceResponse = state
        .nats
        .rpc("wallet.balance.get", &identity.user_id)
        .await?;

    Ok(Json(res))
}

