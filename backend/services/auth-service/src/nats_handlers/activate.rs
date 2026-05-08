use async_nats::{Client, Message};
use common::auth_messages::ActivateResponse;
use serde_json::json;

use crate::db::DbPool;

#[derive(serde::Deserialize)]
struct ActivateRequest {
    token: String,
}

pub async fn handle_activate(pool: DbPool, nats: Client, msg: Message) {
    let payload: ActivateRequest = match serde_json::from_slice(&msg.payload) {
        Ok(v) => v,
        Err(_) => {
            if let Some(reply) = msg.reply {
                let _ = nats
                    .publish(reply, json!({ "error": "invalid payload" }).to_string().into())
                    .await;
            }
            return;
        }
    };

    let ok = sqlx::query(
        r#"
        UPDATE users
        SET is_active = TRUE
        WHERE activation_token = $1
        "#
    )
    .bind(&payload.token)
    .execute(&pool)
    .await
    .is_ok();

    let response = ActivateResponse { ok };

    if let Some(reply) = msg.reply {
        let _ = nats
            .publish(reply, serde_json::to_vec(&response).unwrap().into())
            .await;
    }
}

