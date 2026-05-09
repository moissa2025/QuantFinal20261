use std::sync::Arc;

use axum::{
    extract::Extension,
    routing::get,
    Json, Router,
    response::IntoResponse,
};

use crate::{error::AppError, identity::Identity, state::AppState};

pub fn router() -> Router {
    Router::new()
        .route("/", get(get_balances))
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct BalancesResponse {
    pub cash: f64,
    pub margin: f64,
}

pub async fn get_balances(
    identity: Identity,
    Extension(state): Extension<Arc<AppState>>,
) -> Result<Json<BalancesResponse>, AppError> {
    let res: BalancesResponse = state
        .nats
        .rpc("ledger.balances.get", &identity.user_id)
        .await?;

    Ok(Json(res))
}

async fn health_proxy() -> impl IntoResponse {
    match reqwest::get("http://wallet-service:8080/health").await {
        Ok(resp) => resp.text().await.unwrap_or("FAIL".into()),
        Err(_) => "FAIL".into(),
    }
}

