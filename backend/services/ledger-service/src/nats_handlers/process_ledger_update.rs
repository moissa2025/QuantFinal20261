use async_nats::{Client, Message};
use serde_json::Value;
use crate::db::DbPool;

pub async fn handle_ledger_update(
    payload: Value,
    msg: Message,
    nats: Client,
) {
    println!("ledger update received: {:?}", payload);

    if let Some(reply_to) = msg.reply {
        let response = serde_json::json!({
            "ok": true,
            "received": payload
        });

        let bytes = serde_json::to_vec(&response).unwrap();
        let _ = nats.publish(reply_to, bytes.into()).await;
    }
}

