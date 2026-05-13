use std::sync::Arc;
use axum::{
    extract::WebSocketUpgrade,
    response::IntoResponse,
    Router,
    Extension,
};
use axum::extract::ws::{Message, WebSocket};
use futures::StreamExt;
use crate::state::AppState;

pub fn router() -> Router {
    Router::new()
        .route("/ws/wallet", axum::routing::get(wallet_ws))
}

pub async fn wallet_ws(
    Extension(state): Extension<Arc<AppState>>,
    ws: WebSocketUpgrade,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_wallet_ws(socket, state))
}

async fn handle_wallet_ws(mut socket: WebSocket, state: Arc<AppState>) {
    let Ok(mut sub) = state.nats.subscribe("wallet.updates.*").await else {
        let _ = socket
            .send(Message::Text("Error: unable to subscribe to wallet updates".into()))
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

