use std::sync::Arc;

use axum::{extract::State, Json};
use common::market::MarketRow;
use tokio::time::{timeout, Duration};

use crate::state::AppState;

pub async fn market_snapshot(
    State(state): State<Arc<AppState>>,
) -> Json<Vec<MarketRow>> {
    let mut rx = state.snapshot_tx.subscribe();

    let snapshot = match timeout(Duration::from_secs(2), rx.recv()).await {
        Ok(Ok(s)) => s,
        _ => vec![],
    };

    Json(snapshot)
}

