use async_nats::{Client, Message};
use serde::Deserialize;
use uuid::Uuid;

use crate::db::DbPool;
use crate::repository::role_repo::{assign_role_to_user};
use super::response::RpcResponse;

#[derive(Deserialize)]
struct AssignRoleRequest {
    user_id: Uuid,
    role_id: Uuid,
}

pub async fn handle_assign_role(pool: DbPool, nats: Client, msg: Message) {
    let req: AssignRoleRequest = serde_json::from_slice(&msg.payload).unwrap();

    let result = assign_role_to_user(&pool, req.user_id, req.role_id).await;

    let reply = match result {
        Ok(user_role) => RpcResponse::success(user_role),
        Err(e) => RpcResponse::failure(e),
    };

    if let Some(reply_to) = msg.reply {
        let _ = nats
            .publish(reply_to, serde_json::to_vec(&reply).unwrap().into())
            .await;
    }
}

