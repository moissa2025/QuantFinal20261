use async_nats::{Client, Message};
use serde::Deserialize;
use uuid::Uuid;

use crate::db::DbPool;
use crate::repository::role_repo::get_user_roles;
use super::response::RpcResponse;

#[derive(Deserialize)]
struct GetUserRolesRequest {
    user_id: Uuid,
}

pub async fn handle_get_user_roles(pool: DbPool, nats: Client, msg: Message) {
    let req: GetUserRolesRequest = serde_json::from_slice(&msg.payload).unwrap();

    let result = get_user_roles(&pool, req.user_id).await;

    let reply = match result {
        Ok(roles) => RpcResponse::success(roles),
        Err(e) => RpcResponse::failure(e),
    };

    if let Some(reply_to) = msg.reply {
        let _ = nats
            .publish(reply_to, serde_json::to_vec(&reply).unwrap().into())
            .await;
    }
}

