use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use serde_json::Value;

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct WalletAccount {
    pub id: Uuid,
    pub user_id: Uuid,
    pub currency: String,
    pub balance: f64,
    pub hold: f64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, sqlx::FromRow)]
pub struct WalletTransaction {
    pub id: i64,
    pub account_id: Uuid,
    pub amount: f64,
    pub tx_type: String,
    pub metadata: Value,
    pub created_at: DateTime<Utc>,
}

