use axum::{
    extract::{Path, State},
    http::HeaderMap,
    Json,
};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::sync::Arc;
    use uuid::Uuid;

use crate::{
    repository::wallet_repo,
    state::AppState,
    models::WalletAccount,
};

pub async fn health() -> &'static str {
    "OK"
}

fn extract_user_id(headers: &HeaderMap) -> Result<Uuid, axum::http::StatusCode> {
    let value = headers
        .get("x-user-id")
        .ok_or(axum::http::StatusCode::UNAUTHORIZED)?
        .to_str()
        .map_err(|_| axum::http::StatusCode::UNAUTHORIZED)?;

    Uuid::parse_str(value).map_err(|_| axum::http::StatusCode::UNAUTHORIZED)
}

#[derive(Deserialize)]
pub struct CreateAccountRequest {
    pub currency: Option<String>,
}

pub async fn create_account(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(body): Json<CreateAccountRequest>,
) -> Result<Json<WalletAccount>, axum::http::StatusCode> {
    let user_id = extract_user_id(&headers)?;
    let currency = body.currency.unwrap_or_else(|| "USD".to_string());

    wallet_repo::create_account(&state.pool, user_id, &currency)
        .await
        .map(Json)
        .map_err(|_| axum::http::StatusCode::INTERNAL_SERVER_ERROR)
}

pub async fn get_balance(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Path(account_id): Path<Uuid>,
) -> Result<Json<WalletAccount>, axum::http::StatusCode> {
    let _user_id = extract_user_id(&headers)?;
    wallet_repo::get_balance(&state.pool, account_id)
        .await
        .map(Json)
        .map_err(|_| axum::http::StatusCode::NOT_FOUND)
}

#[derive(Deserialize)]
pub struct AmountRequest {
    pub amount: f64,
    pub metadata: Option<Value>,
}

pub async fn credit(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Path(account_id): Path<Uuid>,
    Json(body): Json<AmountRequest>,
) -> Result<Json<WalletAccount>, axum::http::StatusCode> {
    let _user_id = extract_user_id(&headers)?;
    wallet_repo::credit(&state.pool, account_id, body.amount, body.metadata)
        .await
        .map(Json)
        .map_err(|_| axum::http::StatusCode::BAD_REQUEST)
}

pub async fn debit(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Path(account_id): Path<Uuid>,
    Json(body): Json<AmountRequest>,
) -> Result<Json<WalletAccount>, axum::http::StatusCode> {
    let _user_id = extract_user_id(&headers)?;
    wallet_repo::debit(&state.pool, account_id, body.amount, body.metadata)
        .await
        .map(Json)
        .map_err(|_| axum::http::StatusCode::BAD_REQUEST)
}

#[derive(Deserialize)]
pub struct TransferRequest {
    pub from_account: Uuid,
    pub to_account: Uuid,
    pub amount: f64,
    pub metadata: Option<Value>,
}

#[derive(Serialize)]
pub struct TransferResponse {
    pub from: WalletAccount,
    pub to: WalletAccount,
}

pub async fn transfer(
    State(state): State<Arc<AppState>>,
    headers: HeaderMap,
    Json(body): Json<TransferRequest>,
) -> Result<Json<TransferResponse>, axum::http::StatusCode> {
    let _user_id = extract_user_id(&headers)?;
    wallet_repo::transfer(
        &state.pool,
        body.from_account,
        body.to_account,
        body.amount,
        body.metadata,
    )
    .await
    .map(|(from, to)| Json(TransferResponse { from, to }))
    .map_err(|_| axum::http::StatusCode::BAD_REQUEST)
}

