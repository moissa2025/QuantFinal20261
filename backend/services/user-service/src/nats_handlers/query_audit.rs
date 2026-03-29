use async_nats::{Client, Message};
use serde::Deserialize;
use uuid::Uuid;

use crate::db::DbPool;
use crate::repository::audit_repo::{get_audit_logs_for_user, get_recent_audit_logs};
use super::response::RpcResponse;

#[derive(Deserialize)]
#[serde(tag = "mode")]
enum AuditQuery {
    User { user_id: Uuid, limit: Option<i64> },
    Recent { limit: Option<i64> },
}

pub async fn handle_query_audit(pool: DbPool, nats: Client, msg: Message) {
    let req: AuditQuery = serde_json::from_slice(&msg.payload).unwrap();

    let result = match req {
        AuditQuery::User { user_id, limit } => {
            get_audit_logs_for_user(&pool, user_id, limit.unwrap_or(50)).await
        }
        AuditQuery::Recent { limit } => {
            get_recent_audit_logs(&pool, limit.unwrap_or(50)).await
        }
    };

    let reply = match result {
        Ok(logs) => RpcResponse::success(logs),
        Err(e) => RpcResponse::failure(e),
    };

    if let Some(reply_to) = msg.reply {
        let _ = nats
            .publish(reply_to, serde_json::to_vec(&reply).unwrap().into())
            .await;
    }
}

