use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use sqlx::FromRow;

#[derive(Serialize, Deserialize, FromRow, Debug, Clone)]
pub struct KycRecord {
    pub id: Uuid,
    pub user_id: Uuid,
    pub status: String,
    pub provider: Option<String>,
    pub provider_reference: Option<String>,
    pub risk_score: i32,
    pub rejection_reason: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, FromRow, Debug, Clone)]
pub struct KycDocument {
    pub id: Uuid,
    pub kyc_id: Uuid,
    pub doc_type: String,
    pub file_url: String,
    pub status: String,
    pub rejection_reason: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, FromRow, Debug, Clone)]
pub struct KycAuditLog {
    pub id: Uuid,
    pub kyc_id: Uuid,
    pub event: String,
    pub metadata: serde_json::Value,
    pub created_at: DateTime<Utc>,
}

