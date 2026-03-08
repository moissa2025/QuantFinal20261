use serde::{Serialize, Deserialize};
use uuid::Uuid;

use crate::db::DbPool;
use crate::models::WalletAccount;
use crate::repository::wallet_repo;
use super::response::ApiResponse;

#[derive(Serialize, Deserialize)]
pub struct CreateAccountRequest {
    pub user_id: Uuid,
    pub currency: String,
}

pub async fn handle_create_account(
    pool: DbPool,
    payload: &[u8],
) -> ApiResponse<WalletAccount> {
    let req: CreateAccountRequest = match serde_json::from_slice(payload) {
        Ok(r) => r,
        Err(e) => return ApiResponse::err(format!("invalid payload: {e}")),
    };

    match wallet_repo::create_account(&pool, req.user_id, &req.currency).await {
        Ok(acc) => ApiResponse::ok(acc),
        Err(e) => ApiResponse::err(format!("db error: {e}")),
    }
}

