use std::sync::Arc;

use tokio::sync::broadcast;
use common::market::MarketRow;

#[derive(Clone)]
pub struct AppState {
    pub snapshot_tx: broadcast::Sender<Vec<MarketRow>>,
}

impl AppState {
    pub fn new() -> Arc<Self> {
        let (snapshot_tx, _rx) = broadcast::channel(32);

        Arc::new(Self {
            snapshot_tx,
        })
    }
}

