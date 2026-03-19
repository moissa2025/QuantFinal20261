use async_nats::Client;
use serde::Serialize;
use serde_json::Value;
use sqlx::FromRow;

use crate::db::DbPool;

#[derive(Debug, Serialize, FromRow)]
pub struct HistoryRow {
    pub id: i64,
    pub journal_type: String,
    pub reference_id: Option<String>,
    pub metadata: serde_json::Value,
}

pub async fn handle_get_history(
    pool: &DbPool,
    payload: Value,
    reply: String,
    nats: &Client,
) -> anyhow::Result<()>
{
    let reference_id = payload.get("reference_id").and_then(|v| v.as_str());

    let rows: Vec<HistoryRow> = if let Some(ref_id) = reference_id {
        sqlx::query_as::<_, HistoryRow>(
            r#"
            SELECT id, journal_type, reference_id, metadata
            FROM ledger.journals
            WHERE ledger.reference_id = $1
            ORDER BY id DESC
            "#,
        )
        .bind(ref_id)
        .fetch_all(pool)
        .await?
    } else {
        sqlx::query_as::<_, HistoryRow>(
            r#"
            SELECT id, journal_type, reference_id, metadata
            FROM ledger.journals
            ORDER BY id DESC
            "#,
        )
        .fetch_all(pool)
        .await?
    };

    let response = serde_json::json!({
        "ok": true,
        "journals": rows,
    });

    nats
        .publish(reply, serde_json::to_vec(&response).unwrap().into())
        .await?;

    Ok(())
}

