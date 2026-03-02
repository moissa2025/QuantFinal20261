use async_nats::Client;
use serde_json::Value;
use uuid::Uuid;

use crate::db::DbPool;
use crate::repository::ledger_repo::ensure_account as ensure_account_repo;

pub async fn handle_ensure_account(
    pool: &DbPool,
    payload: Value,
    reply: String,
    nats: &Client,
) -> anyhow::Result<()> {
    let user_id: Option<Uuid> = payload
        .get("user_id")
        .and_then(|v| v.as_str())
        .map(|s| s.parse())
        .transpose()?;

    let code: &str = payload
        .get("code")
        .and_then(|v| v.as_str())
        .unwrap_or("CASH");

    let currency: &str = payload
        .get("currency")
        .and_then(|v| v.as_str())
        .unwrap_or("USD");

    let mut tx = pool.begin().await?;

    let account = ensure_account_repo(&mut tx, user_id, code, currency).await?;

    tx.commit().await?;

    let response = serde_json::json!({
        "ok": true,
        "account": account,
    });

    nats
        .publish(reply, serde_json::to_vec(&response)?.into())
        .await?;

    Ok(())
}

