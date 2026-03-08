use async_nats::{Client, Message};
use serde::Deserialize;
use uuid::Uuid;

use crate::db::DbPool;
use crate::repository::preferences_repo::update_preferences;
use super::response::RpcResponse;

#[derive(Deserialize)]
struct UpdatePreferencesRequest {
    user_id: Uuid,
    theme: Option<String>,
    language: Option<String>,
    timezone: Option<String>,
}

pub async fn handle_update_preferences(pool: DbPool, nats: Client, msg: Message) {
    let req: UpdatePreferencesRequest = serde_json::from_slice(&msg.payload).unwrap();

    let result = update_preferences(
        &pool,
        req.user_id,
        req.theme,
        req.language,
        req.timezone,
    )
    .await;

    let reply = match result {
        Ok(prefs) => RpcResponse::success(prefs),
        Err(e) => RpcResponse::failure(e),
    };

    if let Some(reply_to) = msg.reply {
        let _ = nats
            .publish(reply_to, serde_json::to_vec(&reply).unwrap().into())
            .await;
    }
}

