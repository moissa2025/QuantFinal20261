use axum::{
    extract::ws::{WebSocketUpgrade, WebSocket, Message as AxumMessage, CloseFrame, CloseCode},
    response::IntoResponse,
    routing::get,
    Router,
};
use futures_util::{SinkExt, StreamExt};
use tokio_tungstenite::connect_async;
use tungstenite::Message as TungsteniteMessage;

pub fn router() -> Router {
    Router::new()
        .route("/snapshot", get(proxy_snapshot))
        .route("/stream", get(proxy_stream))
}

pub async fn proxy_snapshot() -> impl IntoResponse {
    let url = "http://market-data-service:8081/market-data/snapshot";

    match reqwest::get(url).await {
        Ok(res) => {
            let status =
                axum::http::StatusCode::from_u16(res.status().as_u16())
                    .unwrap_or(axum::http::StatusCode::BAD_GATEWAY);
            let body = res.text().await.unwrap_or_default();
            (status, body)
        }
        Err(_) => (
            axum::http::StatusCode::BAD_GATEWAY,
            "gateway error".to_string(),
        ),
    }
}

pub async fn proxy_stream(
    ws: WebSocketUpgrade,
) -> impl IntoResponse {
    ws.on_upgrade(handle_ws_proxy)
}

async fn handle_ws_proxy(client_ws: WebSocket) {
    let (internal_ws, _) = connect_async("ws://market-data-service:8081/market-stream")
        .await
        .expect("failed to connect to internal market stream");

    let (mut internal_tx, mut internal_rx) = internal_ws.split();
    let (mut client_tx, mut client_rx) = client_ws.split();

    // INTERNAL → CLIENT
    tokio::spawn(async move {
        while let Some(Ok(msg)) = internal_rx.next().await {
            let converted = match msg {
                TungsteniteMessage::Text(t) => AxumMessage::Text(t),
                TungsteniteMessage::Binary(b) => AxumMessage::Binary(b),
                TungsteniteMessage::Ping(p) => AxumMessage::Ping(p),
                TungsteniteMessage::Pong(p) => AxumMessage::Pong(p),
                TungsteniteMessage::Close(c) => AxumMessage::Close(
                    c.map(|f| CloseFrame {
                        code: CloseCode::from(f.code),
                        reason: f.reason,
                    })
                ),
                _ => continue,
            };

            let _ = client_tx.send(converted).await;
        }
    });

    // CLIENT → INTERNAL
    tokio::spawn(async move {
        while let Some(Ok(msg)) = client_rx.next().await {
            let converted = match msg {
                AxumMessage::Text(t) => TungsteniteMessage::Text(t),
                AxumMessage::Binary(b) => TungsteniteMessage::Binary(b),
                AxumMessage::Ping(p) => TungsteniteMessage::Ping(p),
                AxumMessage::Pong(p) => TungsteniteMessage::Pong(p),
                AxumMessage::Close(c) => TungsteniteMessage::Close(
                    c.map(|f| tungstenite::protocol::CloseFrame {
                        code: tungstenite::protocol::frame::coding::CloseCode::from(f.code),
                        reason: f.reason,
                    })
                ),
            };

            let _ = internal_tx.send(converted).await;
        }
    });
}

