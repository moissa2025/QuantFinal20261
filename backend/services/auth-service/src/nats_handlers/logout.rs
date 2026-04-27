use async_nats::{Client, Message};
use serde_json;
use tracing::error;

use common::auth_messages::AuthLogoutRequest;

use crate::db::DbPool;
use crate::session::revoke_session;

pub async fn handle_logout(pool: DbPool, nats: Client, msg: Message) {
    let req: AuthLogoutRequest = match serde_json::from_slice(&msg.payload) {
        Ok(r) => r,
        Err(e) => {
            error!("logout: invalid payload: {}", e);
            return;
        }
    };

    let _ = revoke_session(&pool, &req.session_token).await;

    if let Some(reply) = msg.reply {
        let _ = nats.publish(reply, b"{}".to_vec().into()).await;
    }
}

