use axum::Json;
use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RiskCheckRequest {
    pub symbol: String,
    pub side: String,
    pub size: f64,
    pub price: f64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RiskCheckResponse {
    pub allowed: bool,
    pub reason: Option<String>,
}

pub async fn check_risk(
    Json(req): Json<RiskCheckRequest>,
) -> Json<RiskCheckResponse> {
    // TODO: real limits, exposure, etc.
    if req.size <= 0.0 {
        return Json(RiskCheckResponse {
            allowed: false,
            reason: Some("size must be positive".into()),
        });
    }

    Json(RiskCheckResponse {
        allowed: true,
        reason: None,
    })
}

