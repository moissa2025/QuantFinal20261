use async_nats::{Client, Message};
use serde_json;
use uuid::Uuid;

use common::auth_messages::{
    AuthValidateSessionRequest,
    AuthValidateSessionResponse,
};

use crate::db::DbPool;
use crate::session::validate_session as http_validate_session;

async fn respond_json<T: serde::Serialize>(nats: &Client, msg: &Message, value: &T) {
    if let Some(reply) = msg.reply.clone() {
        let payload = serde_json::to_vec(value).unwrap();
        let _ = nats.publish(reply, payload.into()).await;
    }
}

pub async fn handle_validate_session(pool: DbPool, nats: Client, msg: Message) {
    let req: AuthValidateSessionRequest = match serde_json::from_slice(&msg.payload) {
        Ok(r) => r,
        Err(_) => {
            let res = AuthValidateSessionResponse {
                valid: false,
                user_id: "".into(),
                roles: vec![],
            };
            respond_json(&nats, &msg, &res).await;
            return;
        }
    };

    let ip = req.ip_address.unwrap_or_default();
    let ua = req.user_agent.unwrap_or_default();

    let result = http_validate_session(
        &pool,
        &req.session_token,
        &ip,
        &ua,
    )
    .await;

    let res = match result {
        Ok(Some((user_id, _email, roles))) => AuthValidateSessionResponse {
            valid: true,
            user_id: user_id.to_string(),
            roles,
        },
        _ => AuthValidateSessionResponse {
            valid: false,
            user_id: "".into(),
            roles: vec![],
        },
    };

    respond_json(&nats, &msg, &res).await;
}

