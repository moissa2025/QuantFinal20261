use async_nats::Message;
use common::auth_messages::{RegisterRequest, RegisterResponse};
use sqlx::PgPool;
use serde_json::json;

pub async fn handle_register(msg: Message, db: PgPool) {
    let payload: RegisterRequest = match serde_json::from_slice(&msg.payload) {
        Ok(v) => v,
        Err(_) => {
            let _ = msg.respond(json!({ "error": "invalid payload" }).to_string().into());
            return;
        }
    };

    // Insert user into DB
    let user_id = match sqlx::query_scalar!(
        r#"
        INSERT INTO users (email, password_hash)
        VALUES ($1, crypt($2, gen_salt('bf')))
        RETURNING id
        "#,
        payload.email,
        payload.password
    )
    .fetch_one(&db)
    .await
    {
        Ok(id) => id,
        Err(_) => {
            let _ = msg.respond(json!({ "error": "registration failed" }).to_string().into());
            return;
        }
    };

    let response = RegisterResponse { user_id };

    let _ = msg.respond(serde_json::to_vec(&response).unwrap().into());
}

