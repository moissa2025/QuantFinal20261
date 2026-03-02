use std::sync::Arc;

use axum::{
    extract::{Query, State, WebSocketUpgrade},
    extract::ws::{Message, WebSocket},
    response::Response,
};
use futures_util::StreamExt;
use serde::Deserialize;
use tokio::time::{interval, Duration};

use common::{
    trading::Position,
    ws::{WsMessage, OrderUpdate},
    messaging::subscribe_json,
    market::MarketRow,
};

use crate::engine::types::EngineEvent;
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

    // Subscribe to streams
    let mut match_sub = subscribe_json::<EngineEvent>("trading.matches")
        .await
        .ok();

    let mut pos_sub = subscribe_json::<Vec<Position>>("trading.positions")
        .await
        .ok();

    let mut market_sub = subscribe_json::<Vec<MarketRow>>("market.snapshot")
        .await
        .ok();

    loop {
        tokio::select! {

            // 1. Send orderbook snapshot every 500ms
            _ = ticker.tick() => {
                if let Some(book) = state.engine.snapshot_book(&symbol).await {
                    let ws_msg = WsMessage::Book(book);
                    if socket.send(Message::Text(serde_json::to_string(&ws_msg).unwrap())).await.is_err() {
                        break;
                    }
                }
            }

            // 2. Match events → OrderUpdate
            Some(ev) = async {
                match &mut match_sub {
                    Some(sub) => sub.next().await,
                    None => None,
                }
            } => {
                if let Ok(event) = ev {
                    if let EngineEvent::Match(m) = event {
                        let update = OrderUpdate {
                            order_id: m.taker_order_id.clone(),
                            symbol: m.symbol.clone(),
                            price: m.price,
                            size: m.size,
                            status: "FILLED".into(),
                        };

                        let ws_msg = WsMessage::OrderUpdate(vec![update]);
                        if socket.send(Message::Text(serde_json::to_string(&ws_msg).unwrap())).await.is_err() {
                            break;
                        }
                    }
                }
            }

            // 3. Position updates
            Some(ev) = async {
                match &mut pos_sub {
                    Some(sub) => sub.next().await,
                    None => None,
                }
            } => {
                if let Ok(positions) = ev {
                    let ws_msg = WsMessage::Position(positions);
                    if socket.send(Message::Text(serde_json::to_string(&ws_msg).unwrap())).await.is_err() {
                        break;
                    }
                }
            }

            // 4. Market snapshots
            Some(ev) = async {
                match &mut market_sub {
                    Some(sub) => sub.next().await,
                    None => None,
                }
            } => {
                if let Ok(snapshot) = ev {
                    let ws_msg = WsMessage::MarketSnapshot(snapshot);
                    if socket.send(Message::Text(serde_json::to_string(&ws_msg).unwrap())).await.is_err() {
                        break;
                    }
                }
            }
        }
    }
}

