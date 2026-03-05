use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct KycRecord {
    pub user_id: String,
    pub status: String,
}

