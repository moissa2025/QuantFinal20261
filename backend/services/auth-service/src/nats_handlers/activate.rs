use async_nats::Message;
use common::auth_messages::ActivateResponse;
use serde_json::json;
use sqlx::PgPool;

#[derive(serde::Deserialize)]
struct ActivateRequest {
    token: String,
}

pub async fn handle_activate(msg: Message, db: PgPool) {
    let payload: ActivateRequest = match serde_json::from_slice(&msg.payload) {
        Ok(v) => v,
        Err(_) => {
            let _ = msg.respond(json!({ "error": "invalid payload" }).to_string().into());
            return;
        }
    };

    let result = sqlx::query!(
        r#"
        UPDATE users
        SET is_active = TRUE
        WHERE activation_token = $1
        "#,
        payload.token
    )
    .execute(&db)
    .await;

    let ok = result.is_ok();

    let response = ActivateResponse { ok };

    let _ = msg.respond(serde_json::to_vec(&response).unwrap().into());
}

