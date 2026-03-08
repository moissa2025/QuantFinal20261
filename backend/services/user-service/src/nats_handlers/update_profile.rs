use async_nats::{Client, Message};
use serde::Deserialize;
use uuid::Uuid;

use crate::db::DbPool;
use crate::repository::profile_repo::update_profile;
use super::response::RpcResponse;

#[derive(Deserialize)]
struct UpdateProfileRequest {
    user_id: Uuid,
    first_name: Option<String>,
    last_name: Option<String>,
    avatar_url: Option<String>,
    bio: Option<String>,
}

pub async fn handle_update_profile(pool: DbPool, nats: Client, msg: Message) {
    let req: UpdateProfileRequest = serde_json::from_slice(&msg.payload).unwrap();

    let result = update_profile(
        &pool,
        req.user_id,
        req.first_name,
        req.last_name,
        req.avatar_url,
        req.bio,
    )
    .await;

    let reply = match result {
        Ok(profile) => RpcResponse::success(profile),
        Err(e) => RpcResponse::failure(e),
    };

    if let Some(reply_to) = msg.reply {
        let _ = nats
            .publish(reply_to, serde_json::to_vec(&reply).unwrap().into())
            .await;
    }
}

