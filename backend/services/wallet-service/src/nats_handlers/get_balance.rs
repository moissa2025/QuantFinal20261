use serde::{Serialize, Deserialize};
use uuid::Uuid;

use crate::db::DbPool;
use crate::models::WalletAccount;
use crate::repository::wallet_repo;
use super::response::ApiResponse;

#[derive(Serialize, Deserialize)]
pub struct GetBalanceRequest {
    pub account_id: Uuid,
}

pub async fn handle_get_balance(
    pool: DbPool,
    payload: &[u8],
) -> ApiResponse<WalletAccount> {
    let req: GetBalanceRequest = match serde_json::from_slice(payload) {
        Ok(r) => r,
        Err(e) => return ApiResponse::err(format!("invalid payload: {e}")),
    };

    match wallet_repo::get_balance(&pool, req.account_id).await {
        Ok(acc) => ApiResponse::ok(acc),
        Err(e) => ApiResponse::err(format!("db error: {e}")),
    }
}

