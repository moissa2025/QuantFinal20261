use serde::{Serialize, Deserialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Serialize, Deserialize, FromRow, Debug, Clone)]
pub struct AmlAlert {
    pub id: Uuid,
    pub user_id: Uuid,
    pub alert_type: String,
    pub risk_score: i32,
    pub description: Option<String>,
    pub status: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Serialize, Deserialize, FromRow, Debug, Clone)]
pub struct SarReport {
    pub id: Uuid,
    pub alert_id: Uuid,
    pub narrative: String,
    pub submitted_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

