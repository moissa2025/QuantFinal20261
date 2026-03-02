use serde::Deserialize;
use common::market::MarketRow;
use futures_util::{StreamExt, SinkExt};
use tokio_tungstenite::{connect_async, tungstenite::Message};

#[derive(Debug, Deserialize)]
struct OkxTickerData {
    instId: String,
    last: String,
    vol24h: String,
}

#[derive(Debug, Deserialize)]
struct OkxWrapper {
    data: Vec<OkxTickerData>,
}

pub async fn start_okx_connector(
    tx: tokio::sync::mpsc::Sender<MarketRow>,
) {
    let url = "wss://ws.okx.com:8443/ws/v5/public";

    let (ws_stream, _) = connect_async(url)
        .await
        .expect("Failed to connect to OKX WS");

    let (mut write, mut read) = ws_stream.split();

    let sub = serde_json::json!({
        "op": "subscribe",
        "args": [{ "channel": "tickers", "instId": "BTC-USDT" }]
    });

    write.send(Message::Text(sub.to_string())).await.unwrap();

    while let Some(Ok(msg)) = read.next().await {
        if let Ok(text) = msg.to_text() {
            if let Ok(wrapper) = serde_json::from_str::<OkxWrapper>(text) {
                for t in wrapper.data {
                    if t.instId == "BTC-USDT" {
                        let row = MarketRow {
                            symbol: "BTC/USDT".into(),
                            name: "Bitcoin".into(),
                            r#type: "Crypto".into(),
                            price: t.last.parse().unwrap_or(0.0),
                            change_pct: 0.0,
                            volume: format!("{} BTC", t.vol24h),
                            mcap: "-".into(),
                        };

                        let _ = tx.send(row).await;
                    }
                }
            }
        }
    }
}

