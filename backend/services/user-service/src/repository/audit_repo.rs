use sqlx::{query, query_as};
use uuid::Uuid;
use serde_json::Value;

use crate::db::DbPool;
use crate::models::AuditLog;

// INSERT AUDIT LOG
pub async fn insert_audit_log(
    pool: &DbPool,
    user_id: Option<Uuid>,
    action: &str,
    metadata: Value,
) -> Result<(), sqlx::Error> {
    query(
        r#"
        INSERT INTO users.audit_logs (user_id, action, metadata)
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

// GET AUDIT LOGS FOR A USER
pub async fn get_audit_logs_for_user(
    pool: &DbPool,
    user_id: Uuid,
    limit: i64,
) -> Result<Vec<AuditLog>, sqlx::Error> {
    query_as::<_, AuditLog>(
        r#"
        SELECT *
        FROM users.audit_logs
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2
        "#
    )
    .bind(user_id)
    .bind(limit)
    .fetch_all(pool)
    .await
}

// GET RECENT AUDIT LOGS (GLOBAL)
pub async fn get_recent_audit_logs(
    pool: &DbPool,
    limit: i64,
) -> Result<Vec<AuditLog>, sqlx::Error> {
    query_as::<_, AuditLog>(
        r#"
        SELECT *
        FROM users.audit_logs
        ORDER BY created_at DESC
        LIMIT $1
        "#
    )
    .bind(limit)
    .fetch_all(pool)
    .await
}

