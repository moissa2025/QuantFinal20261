use async_nats::{Client, Message};
use serde::Deserialize;
use uuid::Uuid;

use crate::db::DbPool;

#[derive(Deserialize)]
struct UpdateUserRequest {
    user_id: Uuid,
    email: Option<String>,
    username: Option<String>,
}

pub async fn handle_update_user(_pool: DbPool, nats: Client, msg: Message) {
    // TODO: implement update logic
    let reply = serde_json::to_vec(&"not implemented").unwrap();

    if let Some(reply_to) = msg.reply {
        let _ = nats.publish(reply_to, reply.into()).await;
    }
}

