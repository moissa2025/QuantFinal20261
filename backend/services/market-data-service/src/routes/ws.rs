use std::sync::Arc;

use axum::{
    extract::{State, WebSocketUpgrade},
    extract::ws::{Message, WebSocket},
    response::Response,
};
use common::ws::WsMessage;
use tokio::time::{timeout, Duration};

use crate::state::AppState;

pub async fn market_stream(
    ws: WebSocketUpgrade,
    State(state): State<Arc<AppState>>,
) -> Response {
    ws.on_upgrade(move |socket| handle_market_stream(socket, state))
}

async fn handle_market_stream(mut socket: WebSocket, state: Arc<AppState>) {
    let mut rx = state.snapshot_tx.subscribe();

    loop {
        let result = timeout(Duration::from_secs(5), rx.recv()).await;

        let snapshot = match result {
            Ok(Ok(s)) => s,
            Ok(Err(_)) => continue,
            Err(_) => continue,
        };

        let msg = WsMessage::MarketSnapshot(snapshot);

        let json = match serde_json::to_string(&msg) {
            Ok(j) => j,
            Err(_) => continue,
        };

        if socket.send(Message::Text(json)).await.is_err() {
            break;
        }
    }
}

