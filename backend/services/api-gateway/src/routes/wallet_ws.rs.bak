use std::sync::Arc;

use axum::extract::ws::{Message, WebSocket};
use futures::StreamExt;

use crate::state::AppState;

/// Handles the wallet WebSocket stream (NATS subscriber)
pub async fn wallet_ws_handler(mut socket: WebSocket, state: Arc<AppState>) {
    let mut sub = state.nats.subscribe("wallet.*").await.unwrap();

    while let Some(msg) = sub.next().await {
        if let Ok(text) = String::from_utf8(msg.payload.to_vec()) {
            let _ = socket.send(Message::Text(text)).await;
        }
    }
}

