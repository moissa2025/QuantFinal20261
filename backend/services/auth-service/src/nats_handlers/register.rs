use async_nats::{Client, Message};
use common::auth_messages::{RegisterRequest, RegisterResponse};
use serde_json::json;
use sqlx::Row;

use crate::db::DbPool;

pub async fn handle_register(pool: DbPool, nats: Client, msg: Message) {
    let payload: RegisterRequest = match serde_json::from_slice(&msg.payload) {
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

    let user_id: String = match sqlx::query(
        r#"
        INSERT INTO users (email, password_hash)
        VALUES ($1, crypt($2, gen_salt('bf')))
        RETURNING id
        "#
    )
    .bind(&payload.email)
    .bind(&payload.password)
    .fetch_one(&pool)
    .await
    {
        Ok(row) => row.get("id"),
        Err(_) => {
            if let Some(reply) = msg.reply {
                let _ = nats
                    .publish(reply, json!({ "error": "registration failed" }).to_string().into())
                    .await;
            }
            return;
        }
    };

    let response = RegisterResponse { user_id };

    if let Some(reply) = msg.reply {
        let _ = nats
            .publish(reply, serde_json::to_vec(&response).unwrap().into())
            .await;
    }
}

