use tokio_tungstenite::{connect_async, tungstenite::Message};
use serde::Deserialize;
use common::market::MarketRow;
use futures_util::{StreamExt, SinkExt};

#[derive(Debug, Deserialize)]
struct CoinbaseTicker {
    price: String,
    product_id: String,
}

pub async fn start_coinbase_connector(
    tx: tokio::sync::mpsc::Sender<MarketRow>,
) {
    let url = "wss://ws-feed.exchange.coinbase.com";

    let (ws_stream, _) = connect_async(url)
        .await
        .expect("Failed to connect to Coinbase WS");

    let (mut write, mut read) = ws_stream.split();

    let sub = serde_json::json!({
        "type": "subscribe",
        "channels": [{ "name": "ticker", "product_ids": ["BTC-USD"] }]
    });

    write.send(Message::Text(sub.to_string())).await.unwrap();

    while let Some(Ok(msg)) = read.next().await {
        if let Ok(text) = msg.to_text() {
            if let Ok(t) = serde_json::from_str::<CoinbaseTicker>(text) {
                if t.product_id == "BTC-USD" {
                    let row = MarketRow {
                        symbol: "BTC/USD".into(),
                        name: "Bitcoin".into(),
                        r#type: "Crypto".into(),
                        price: t.price.parse().unwrap_or(0.0),
                        change_pct: 0.0,
                        volume: "-".into(),
                        mcap: "-".into(),
                    };

                    let _ = tx.send(row).await;
                }
            }
        }
    }
}

