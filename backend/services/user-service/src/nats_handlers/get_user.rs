use async_nats::{Client, Message};
use serde::Deserialize;
use uuid::Uuid;

use crate::db::DbPool;
use crate::repository::user_repo::get_user;
use super::response::RpcResponse;

#[derive(Deserialize)]
struct GetUserRequest {
    user_id: Uuid,
}

pub async fn handle_get_user(pool: DbPool, nats: Client, msg: Message) {
    let req: GetUserRequest = serde_json::from_slice(&msg.payload).unwrap();

    let result = get_user(&pool, req.user_id).await;

    let reply = match result {
        Ok(user) => RpcResponse::success(user),
        Err(e) => RpcResponse::failure(e),
    };

    let payload = serde_json::to_vec(&reply).unwrap();

    if let Some(reply_to) = msg.reply {
        let _ = nats.publish(reply_to, payload.into()).await;
    }
}

