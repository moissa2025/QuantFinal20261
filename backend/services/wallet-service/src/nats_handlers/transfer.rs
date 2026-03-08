use serde::{Serialize, Deserialize};
use uuid::Uuid;
use serde_json::Value;

use crate::db::DbPool;
use crate::models::WalletAccount;
use crate::repository::wallet_repo;
use super::response::ApiResponse;

#[derive(Serialize, Deserialize)]
pub struct TransferRequest {
    pub from_account: Uuid,
    pub to_account: Uuid,
    pub amount: f64,
    pub metadata: Option<Value>,
}

#[derive(Serialize, Deserialize)]
pub struct TransferResult {
    pub from: WalletAccount,
    pub to: WalletAccount,
}

pub async fn handle_transfer(
    pool: DbPool,
    payload: &[u8],
) -> ApiResponse<TransferResult> {
    let req: TransferRequest = match serde_json::from_slice(payload) {
        Ok(r) => r,
        Err(e) => return ApiResponse::err(format!("invalid payload: {e}")),
    };

    match wallet_repo::transfer(
        &pool,
        req.from_account,
        req.to_account,
        req.amount,
        req.metadata,
    )
    .await
    {
        Ok((from, to)) => ApiResponse::ok(TransferResult { from, to }),
        Err(e) => ApiResponse::err(format!("db error: {e}")),
    }
}

