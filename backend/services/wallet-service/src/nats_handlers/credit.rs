use serde::{Serialize, Deserialize};
use uuid::Uuid;
use serde_json::Value;

use crate::db::DbPool;
use crate::models::WalletAccount;
use crate::repository::wallet_repo;
use super::response::ApiResponse;

#[derive(Serialize, Deserialize)]
pub struct CreditRequest {
    pub account_id: Uuid,
    pub amount: f64,
    pub metadata: Option<Value>,
}

pub async fn handle_credit(
    pool: DbPool,
    payload: &[u8],
) -> ApiResponse<WalletAccount> {
    let req: CreditRequest = match serde_json::from_slice(payload) {
        Ok(r) => r,
        Err(e) => return ApiResponse::err(format!("invalid payload: {e}")),
    };

    match wallet_repo::credit(&pool, req.account_id, req.amount, req.metadata).await {
        Ok(acc) => ApiResponse::ok(acc),
        Err(e) => ApiResponse::err(format!("db error: {e}")),
    }
}

