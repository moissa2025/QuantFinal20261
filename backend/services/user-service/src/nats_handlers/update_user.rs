use async_nats::{Client, Message};
use serde::Deserialize;
use uuid::Uuid;

use crate::db::DbPool;
use crate::repository::user_repo::update_user;
use super::response::RpcResponse;

#[derive(Deserialize)]
struct UpdateUserRequest {
    user_id: Uuid,
    email: Option<String>,
    username: Option<String>,
}

pub async fn handle_update_user(pool: DbPool, nats: Client, msg: Message) {
    let req: UpdateUserRequest = serde_json::from_slice(&msg.payload).unwrap();

    let result = update_user(&pool, req.user_id, req.email, req.username).await;

    let reply = match result {
        Ok(user) => RpcResponse::success(user),
        Err(e) => RpcResponse::failure(e),
    };

    if let Some(reply_to) = msg.reply {
        let _ = nats.publish(reply_to, serde_json::to_vec(&reply).unwrap().into()).await;
    }
}

