use serde::{Serialize, Deserialize};
use sqlx::FromRow;

#[derive(Serialize, Deserialize, FromRow)]
pub struct WalletAccount {
    pub id: uuid::Uuid,
    pub user_id: uuid::Uuid,
    pub currency: String,
    pub balance: f64,
    pub hold: f64,
    pub btc_address: Option<String>,
    pub eth_address: Option<String>,
    pub crypto_balance_usd: f64,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct WalletTransaction {
    pub id: uuid::Uuid,
    pub account_id: uuid::Uuid,
    pub amount: f64,
    pub tx_type: String,
    pub metadata: serde_json::Value,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

