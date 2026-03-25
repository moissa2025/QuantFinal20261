use axum::{
    extract::{State, WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
};
use hyper::Client;
use futures_util::{StreamExt, SinkExt};
use tokio_tungstenite::connect_async;
use crate::state::AppState;

pub async fn proxy_snapshot(State(_state): State<AppState>) -> impl IntoResponse {
    let uri = "http://market-data-service:8081/market-data/snapshot"
        .parse()
        .unwrap();

    let client = Client::new();
    match client.get(uri).await {
        Ok(res) => res.into_response(),
        Err(_) => axum::http::StatusCode::BAD_GATEWAY.into_response(),
    }
}

pub async fn proxy_stream(ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(|socket| async move {
        let (mut internal_ws, _) =
            connect_async("ws://market-data-service:8081/market-stream")
                .await
                .expect("failed to connect to internal market stream");

        let (mut client_tx, mut client_rx) = socket.split();
        let (mut internal_tx, mut internal_rx) = internal_ws.split();

        tokio::spawn(async move {
            while let Some(Ok(msg)) = internal_rx.next().await {
                let _ = client_tx.send(msg).await;
            }
        });

        tokio::spawn(async move {
            while let Some(Ok(msg)) = client_rx.next().await {
                let _ = internal_tx.send(msg).await;
            }
        });
    })
}
