use std::collections::HashMap;
use std::sync::Arc;

use tokio::sync::mpsc;
use tokio::time::{interval, Duration};

use common::market::MarketRow;
use common::messaging::publish_json;

use crate::engine::connectors::{binance, coinbase, okx};
use crate::state::AppState;

pub async fn run_aggregator(state: Arc<AppState>) {
    let (tx, mut rx) = mpsc::channel::<MarketRow>(1024);

    tokio::spawn({
        let tx = tx.clone();
        async move { binance::start_binance_connector(tx).await }
    });

    tokio::spawn({
        let tx = tx.clone();
        async move { coinbase::start_coinbase_connector(tx).await }
    });

    tokio::spawn({
        let tx = tx.clone();
        async move { okx::start_okx_connector(tx).await }
    });

    let mut books: HashMap<String, MarketRow> = HashMap::new();
    let mut snapshot_timer = interval(Duration::from_millis(500));

    loop {
        tokio::select! {
            Some(row) = rx.recv() => {
                books.insert(row.symbol.clone(), row);
            }

            _ = snapshot_timer.tick() => {
                if books.is_empty() {
                    continue;
                }

                let snapshot: Vec<MarketRow> = books.values().cloned().collect();

                let _ = publish_json("market.snapshot", &snapshot).await;

                let _ = state.snapshot_tx.send(snapshot);
            }
        }
    }
}

