use std::sync::Arc;

use axum::{
    extract::{Query, State, WebSocketUpgrade},
    extract::ws::{Message, WebSocket},
    response::Response,
};
use serde::Deserialize;
use tokio::time::{interval, Duration};

use common::ws::WsMessage;

use crate::state::AppState;

#[derive(Debug, Deserialize)]
pub struct TerminalParams {
    pub symbol: String,
}

pub async fn terminal_stream(
    ws: WebSocketUpgrade,
    Query(params): Query<TerminalParams>,
    State(state): State<Arc<AppState>>,
) -> Response {
    ws.on_upgrade(move |socket| handle_terminal_stream(socket, state, params.symbol))
}

async fn handle_terminal_stream(
    mut socket: WebSocket,
    state: Arc<AppState>,
    symbol: String,
) {
    let mut ticker = interval(Duration::from_millis(500));

    loop {
        tokio::select! {

            // Send orderbook snapshot every 500ms
            _ = ticker.tick() => {
                if let Some(book) = state.engine.snapshot_book(&symbol).await {
                    let ws_msg = WsMessage::Book(book);
                    if socket
                        .send(Message::Text(serde_json::to_string(&ws_msg).unwrap()))
                        .await
                        .is_err()
                    {
                        break;
                    }
                }
            }
        }
    }
}

