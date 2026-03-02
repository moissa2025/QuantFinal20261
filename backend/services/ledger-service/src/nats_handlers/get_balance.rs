use async_nats::{Client, Message};
use serde::Deserialize;
use uuid::Uuid;
use crate::db::DbPool;
use crate::repository::ledger_repo::get_balance;

#[derive(Deserialize)]
pub struct GetBalanceRequest {
    pub user_id: Uuid,
    pub account_code: String,
    pub currency: String,
}

pub async fn handle_get_balance(
    payload: serde_json::Value,
    msg: Message,
    nats: Client,
    pool: DbPool,
) {
    let req: GetBalanceRequest = match serde_json::from_value(payload) {
        Ok(v) => v,
        Err(e) => {
            if let Some(reply) = msg.reply {
                let err = serde_json::json!({ "ok": false, "error": e.to_string() });
                let _ = nats.publish(reply, serde_json::to_vec(&err).unwrap().into()).await;
            }
            return;
        }
    };

    let result = get_balance(&pool, req.user_id, &req.account_code, &req.currency).await;

    if let Some(reply) = msg.reply {
        let response = match result {
            Ok(balance) => serde_json::json!({ "ok": true, "balance": balance }),
            Err(e) => serde_json::json!({ "ok": false, "error": e.to_string() }),
        };

        let _ = nats.publish(reply, serde_json::to_vec(&response).unwrap().into()).await;
    }
}

