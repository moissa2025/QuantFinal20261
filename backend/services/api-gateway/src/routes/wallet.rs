use axum::{
    Json,
    extract::{State, Path, WebSocketUpgrade},
    Router,
    routing::{get, post},
    response::IntoResponse,
};
use serde_json::{Value, json};
use uuid::Uuid;
use std::sync::Arc;
use axum::extract::ws::{Message, WebSocket};
use futures::StreamExt;

use crate::{
    state::AppState,
    error::AppError,
    identity::Identity,
};

//
// ─────────────────────────────────────────────────────────────
//   ROUTER
// ─────────────────────────────────────────────────────────────
//

pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/wallet/accounts", post(create_wallet_account))
        .route("/wallet/accounts/:id", get(get_wallet_balance))
        .route("/wallet/accounts/:id/credit", post(credit_wallet))
        .route("/wallet/accounts/:id/debit", post(debit_wallet))
        .route("/wallet/transfer", post(transfer_wallet))
        .route("/wallet/history", get(wallet_history))
        .route("/wallet/crypto/deposit", post(crypto_deposit))
        .route("/wallet/crypto/history", get(crypto_history))
        .route("/wallet/subaccounts", get(list_subaccounts))
        .route("/ws/wallet", get(wallet_ws))
}

//
// ─────────────────────────────────────────────────────────────
//   NATS RPC ROUTES
// ─────────────────────────────────────────────────────────────
//

async fn create_wallet_account(
    State(state): State<Arc<AppState>>,
    Identity { user_id, .. }: Identity,
    Json(body): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let mut payload = body.clone();
    payload["user_id"] = json!(user_id);

    let resp: Value = state.nats.rpc("wallet.account.create", &payload).await?;
    Ok(Json(resp))
}

async fn get_wallet_balance(
    State(state): State<Arc<AppState>>,
    Identity { user_id, .. }: Identity,
    Path(id): Path<Uuid>,
) -> Result<Json<Value>, AppError> {
    let payload = json!({
        "account_id": id,
        "user_id": user_id
    });

    let resp: Value = state.nats.rpc("wallet.balance.get", &payload).await?;
    Ok(Json(resp))
}

async fn credit_wallet(
    State(state): State<Arc<AppState>>,
    Identity { user_id, .. }: Identity,
    Path(id): Path<Uuid>,
    Json(body): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let mut payload = body.clone();
    payload["account_id"] = json!(id);
    payload["user_id"] = json!(user_id);

    let resp: Value = state.nats.rpc("wallet.credit", &payload).await?;
    Ok(Json(resp))
}

async fn debit_wallet(
    State(state): State<Arc<AppState>>,
    Identity { user_id, .. }: Identity,
    Path(id): Path<Uuid>,
    Json(body): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let mut payload = body.clone();
    payload["account_id"] = json!(id);
    payload["user_id"] = json!(user_id);

    let resp: Value = state.nats.rpc("wallet.debit", &payload).await?;
    Ok(Json(resp))
}

async fn transfer_wallet(
    State(state): State<Arc<AppState>>,
    Identity { user_id, .. }: Identity,
    Json(body): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let mut payload = body.clone();
    payload["user_id"] = json!(user_id);

    let resp: Value = state.nats.rpc("wallet.transfer", &payload).await?;
    Ok(Json(resp))
}

async fn wallet_history(
    State(state): State<Arc<AppState>>,
    Identity { user_id, .. }: Identity,
) -> Result<Json<Value>, AppError> {
    let resp: Value = state
        .nats
        .rpc("wallet.history", &json!({ "user_id": user_id }))
        .await?;
    Ok(Json(resp))
}

async fn crypto_history(
    State(state): State<Arc<AppState>>,
    Identity { user_id, .. }: Identity,
) -> Result<Json<Value>, AppError> {
    let resp: Value = state
        .nats
        .rpc("wallet.crypto.history", &json!({ "user_id": user_id }))
        .await?;
    Ok(Json(resp))
}

async fn list_subaccounts(
    State(state): State<Arc<AppState>>,
    Identity { user_id, .. }: Identity,
) -> Result<Json<Value>, AppError> {
    let resp: Value = state
        .nats
        .rpc("wallet.subaccounts.list", &json!({ "user_id": user_id }))
        .await?;
    Ok(Json(resp))
}

async fn crypto_deposit(
    State(state): State<Arc<AppState>>,
    Json(body): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let resp: Value = state.nats.rpc("wallet.crypto.deposit", &body).await?;
    Ok(Json(resp))
}

//
// ─────────────────────────────────────────────────────────────
//   WEBSOCKET STREAM (NATS SUBSCRIBER)
// ─────────────────────────────────────────────────────────────
//

pub async fn wallet_ws(
    ws: WebSocketUpgrade,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_wallet_ws(socket, state))
}

async fn handle_wallet_ws(mut socket: WebSocket, state: Arc<AppState>) {
    let mut sub = state.nats.subscribe("wallet.*").await.unwrap();

    while let Some(msg) = sub.next().await {
        if let Ok(text) = String::from_utf8(msg.payload.to_vec()) {
            let _ = socket.send(Message::Text(text)).await;
        }
    }
}

