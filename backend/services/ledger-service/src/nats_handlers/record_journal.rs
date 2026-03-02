use async_nats::{Client, Message};
use serde::Deserialize;
use uuid::Uuid;

use crate::db::DbPool;
use crate::repository::ledger_repo::record_double_entry;

#[derive(Deserialize)]
pub struct JournalEntryRequest {
    pub user_id: Option<Uuid>,
    pub account_code: String,
    pub currency: String,
    pub direction: String,
    pub amount: f64,
    pub metadata: serde_json::Value,
}

#[derive(Deserialize)]
pub struct RecordJournalRequest {
    pub journal_type: String,
    pub reference_id: Option<String>,
    pub metadata: serde_json::Value,
    pub entries: Vec<JournalEntryRequest>,
}

pub async fn handle_record_journal(
    payload: serde_json::Value,
    msg: Message,
    nats: Client,
    pool: DbPool,
) {
    let req: RecordJournalRequest = match serde_json::from_value(payload) {
        Ok(v) => v,
        Err(e) => {
            if let Some(reply) = msg.reply {
                let err = serde_json::json!({ "ok": false, "error": e.to_string() });
                let _ = nats.publish(reply, serde_json::to_vec(&err).unwrap().into()).await;
            }
            return;
        }
    };

    let entries = req.entries
        .into_iter()
        .map(|e| {
            (
                e.user_id,
                e.account_code.clone(),
                e.currency.clone(),
                e.direction.clone(),
                e.amount,
                e.metadata,
            )
        })
        .collect::<Vec<_>>();

    let result = record_double_entry(
        &pool,
        &req.journal_type,
        req.reference_id.as_deref(),
        req.metadata.clone(),
        entries,
    )
    .await;

    if let Some(reply) = msg.reply {
        let response = match result {
            Ok(journal) => serde_json::json!({ "ok": true, "journal_id": journal.id }),
            Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
        };

        let _ = nats.publish(reply, serde_json::to_vec(&response).unwrap().into()).await;
    }
}

