use sqlx::query;
use uuid::Uuid;
use serde_json::Value;

use crate::db::DbPool;

pub async fn insert_audit_log(
    pool: &DbPool,
    user_id: Option<Uuid>,
    action: &str,
    metadata: Value,
) -> Result<(), sqlx::Error> {
    query(
        r#"
        INSERT INTO audit_logs (user_id, action, metadata)
        VALUES ($1, $2, $3)
        "#
    )
    .bind(user_id)
    .bind(action)
    .bind(metadata)
    .execute(pool)
    .await?;

    Ok(())
}

