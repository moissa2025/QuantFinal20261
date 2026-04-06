use std::sync::Arc;
use axum::extract::State;

use crate::{
    dto::MarketSnapshot,
    services::market_data,
    state::AppState,
};

pub async fn handle_markets(
    State(state): State<Arc<AppState>>,
) -> anyhow::Result<MarketSnapshot> {
    let snapshot = market_data::get_market_snapshot(&state.db).await?;
    Ok(snapshot)
}

