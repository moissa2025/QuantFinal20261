use async_nats::{Client, Message};
use serde::Deserialize;

use crate::db::DbPool;
use crate::repository::user_repo::create_user;
use super::response::RpcResponse;

#[derive(Deserialize)]
struct CreateUserRequest {
    email: String,
    username: String,
}

pub async fn handle_create_user(pool: DbPool, nats: Client, msg: Message) {
    let req: CreateUserRequest = serde_json::from_slice(&msg.payload).unwrap();

    let result = create_user(&pool, &req.email, &req.username).await;

    let reply = match result {
        Ok(user) => RpcResponse::success(user),
        Err(e) => RpcResponse::failure(e),
    };

    let payload = serde_json::to_vec(&reply).unwrap();

    if let Some(reply_to) = msg.reply {
        let _ = nats.publish(reply_to, payload.into()).await;
    }
}

