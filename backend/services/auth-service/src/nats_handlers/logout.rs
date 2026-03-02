use async_nats::{Client, Message};
use serde_json;

use common::auth_messages::AuthLogoutRequest;

use crate::db::DbPool;

pub async fn handle_logout(pool: DbPool, nats: Client, msg: Message) {
    let req: AuthLogoutRequest = match serde_json::from_slice(&msg.payload) {
        Ok(r) => r,
        Err(_) => {
            respond_raw(&nats, &msg, b"invalid request").await;
            return;
        }
    };

    let _ = sqlx::query!(
        r#"UPDATE sessions SET revoked = true WHERE session_token = $1"#,
        req.session_token
    )
    .execute(&pool)
    .await;

    respond_raw(&nats, &msg, b"ok").await;
}

async fn respond_raw(nats: &Client, msg: &Message, bytes: &[u8]) {
    if let Some(reply) = msg.reply.clone() {
        let _ = nats.publish(reply, bytes.to_vec().into()).await;
    }
}

