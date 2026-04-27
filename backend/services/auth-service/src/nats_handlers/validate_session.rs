use async_nats::{Client, Message};
use serde_json;

use common::auth_messages::{
    AuthValidateSessionRequest,
    AuthValidateSessionResponse,
};

use crate::db::DbPool;
use crate::session::{validate_session as http_validate_session, normalise_device_ua, hash_device_ua};

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
            respond_json(&nats, &msg, &AuthValidateSessionResponse {
                valid: false,
                user_id: "".into(),
                roles: vec![],
            }).await;
            return;
        }
    };

    let ip = req.ip_address.unwrap_or_default();
    let ua_raw = req.user_agent.unwrap_or_default();
    let ua_norm = normalise_device_ua(&ua_raw);
    let device_hash = hash_device_ua(&ua_norm);

    let result = http_validate_session(
        &pool,
        &req.session_token,
        &ip,
        &device_hash,
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

