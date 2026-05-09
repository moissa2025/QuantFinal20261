use futures_util::{StreamExt, SinkExt};
use tokio_tungstenite::connect_async;
use serde::Deserialize;
use common::market::MarketRow;

#[derive(Debug, Deserialize)]
struct BinanceTicker {
    s: String,
    c: String,
    P: String,
    v: String,
}

pub async fn start_binance_connector(
    tx: tokio::sync::mpsc::Sender<MarketRow>,
) {
    let url = "wss://stream.binance.com:9443/ws/!ticker@arr";

    let (ws_stream, _) = connect_async(url)
        .await
        .expect("Failed to connect to Binance WS");

    let (_, mut read) = ws_stream.split();

    while let Some(Ok(msg)) = read.next().await {
        if let Ok(text) = msg.to_text() {
            if let Ok(arr) = serde_json::from_str::<Vec<BinanceTicker>>(text) {
                for t in arr {
                    if t.s == "BTCUSDT" {
                        let row = MarketRow {
                            symbol: "BTC/USDT".into(),
                            name: "Bitcoin".into(),
                            r#type: "Crypto".into(),
                            price: t.c.parse().unwrap_or(0.0),
                            change_pct: t.P.parse().unwrap_or(0.0),
                            volume: format!("{} BTC", t.v),
                            mcap: "-".into(),
                        };

                        let _ = tx.send(row).await;
                    }
                }
            }
        }
    }
}

