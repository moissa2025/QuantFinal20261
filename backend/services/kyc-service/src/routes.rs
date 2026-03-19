use axum::{
    extract::{State, Path},
    Json,
};
use serde_json::json;
use sqlx::PgPool;
use uuid::Uuid;

use crate::models::KycRecord;

pub async fn health() -> &'static str {
    "OK"
}

pub async fn get_kyc_status(
    State(db): State<PgPool>,
    Path(user_id): Path<String>,
) -> Json<serde_json::Value> {
    // Parse UUID safely
    let user_uuid = match Uuid::parse_str(&user_id) {
        Ok(id) => id,
        Err(_) => {
            return Json(json!({
                "error": "invalid_user_id"
            }));
        }
    };

    // Query the latest KYC record for this user
    let record = sqlx::query_as::<_, KycRecord>(
        r#"
        SELECT *
        FROM auth.kyc_records
        WHERE auth.user_id = $1
        ORDER BY created_at DESC
        LIMIT 1
        "#
    )
    .bind(user_uuid)
    .fetch_optional(&db)
    .await
    .expect("Failed to query kyc_records");

    match record {
        Some(r) => Json(json!({
            "user_id": r.user_id.to_string(),
            "status": r.status,
            "provider": r.provider,
            "provider_reference": r.provider_reference,
            "risk_score": r.risk_score,
            "rejection_reason": r.rejection_reason,
            "created_at": r.created_at.to_rfc3339(),
            "updated_at": r.updated_at.to_rfc3339(),
        })),
        None => Json(json!({
            "user_id": user_uuid.to_string(),
            "status": "not_started"
        })),
    }
}

