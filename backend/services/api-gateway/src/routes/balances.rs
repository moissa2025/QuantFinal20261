use std::sync::Arc;

use axum::{
    extract::State,
    routing::get,
    Json, Router,
};

use crate::{error::AppError, identity::Identity, state::AppState};

pub fn router() -> Router<Arc<AppState>> {
    Router::new().route("/", get(get_balances))
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct BalancesResponse {
    pub cash: f64,
    pub margin: f64,
}

#[tracing::instrument(
    name = "get_balances",
    skip(state, identity),
    fields(user_id = %identity.user_id)
)]
pub async fn get_balances(
    identity: Identity,
    State(state): State<Arc<AppState>>,
) -> Result<Json<BalancesResponse>, AppError> {
    let res: BalancesResponse = state
        .nats
        .rpc("ledger.balances.get", &identity.user_id)
        .await?;

    Ok(Json(res))
}

