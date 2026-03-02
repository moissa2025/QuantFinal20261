use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Account {
    pub id: Uuid,
    pub user_id: Option<Uuid>,
    pub code: String,          // e.g. CASH, MARGIN, FEES, PNL_REALIZED
    pub currency: String,      // e.g. USD, USDT, BTC
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Journal {
    pub id: Uuid,
    pub journal_type: String,  // e.g. TRADE_SETTLEMENT, DEPOSIT
    pub reference_id: Option<String>,
    pub metadata: serde_json::Value,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Entry {
    pub id: Uuid,
    pub journal_id: Uuid,
    pub account_id: Uuid,
    pub direction: String,     // "DEBIT" or "CREDIT"
    pub amount: f64,
    pub currency: String,
    pub metadata: serde_json::Value,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct AuditLog {
    pub id: i64,
    pub event_type: String,
    pub entity_type: String,
    pub entity_id: Option<Uuid>,
    pub metadata: serde_json::Value,
    pub created_at: DateTime<Utc>,
}

