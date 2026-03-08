use async_nats::{Client, Message};
use serde::Deserialize;
use serde_json::Value;
use uuid::Uuid;

use crate::db::DbPool;
use crate::repository::audit_repo::insert_audit_log;
use super::response::RpcResponse;

#[derive(Deserialize)]
struct AuditLogRequest {
    user_id: Option<Uuid>,
    action: String,
    metadata: Value,
}

pub async fn handle_audit_log(pool: DbPool, nats: Client, msg: Message) {
    let req: AuditLogRequest = serde_json::from_slice(&msg.payload).unwrap();

    let result = insert_audit_log(
        &pool,
        req.user_id,
        &req.action,
        req.metadata,
    )
    .await;

    let reply = match result {
        Ok(_) => RpcResponse::success("logged"),
        Err(e) => RpcResponse::failure(e),
    };

    if let Some(reply_to) = msg.reply {
        let _ = nats
            .publish(reply_to, serde_json::to_vec(&reply).unwrap().into())
            .await;
    }
}

