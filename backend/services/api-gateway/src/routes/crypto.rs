use std::sync::Arc;

use axum::{
    Router,
    routing::get,
    extract::{State, WebSocketUpgrade},
    response::IntoResponse,
};
use axum::extract::ws::{Message, WebSocket};
use futures::StreamExt;

use crate::state::AppState;

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/ws/crypto-prices", get(crypto_prices_ws))
}

pub async fn crypto_prices_ws(
    ws: WebSocketUpgrade,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_crypto_prices_ws(socket, state))
}

async fn handle_crypto_prices_ws(mut socket: WebSocket, state: Arc<AppState>) {
    let Ok(mut sub) = state.nats.subscribe("prices.crypto.*").await else {
        let _ = socket
            .send(Message::Text("Error: unable to subscribe to crypto price feed".into()))
            .await;
        return;
    };

    while let Some(msg) = sub.next().await {
        if let Ok(text) = String::from_utf8(msg.payload.to_vec()) {
            if socket.send(Message::Text(text)).await.is_err() {
                break;
            }
        }
    }

    let _ = socket.close().await;
}

