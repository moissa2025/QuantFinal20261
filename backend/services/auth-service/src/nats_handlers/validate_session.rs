use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::{AuthValidateSessionRequest, AuthValidateSessionResponse};

pub async fn handle_validate_session(nats: Client, db: PgPool) -> Result<()> {
  let mut sub = nats.subscribe("auth.validate_session").await?;

    while let Some(msg) = sub.next().await {
        let req: AuthValidateSessionRequest = serde_json::from_slice(&msg.payload)?;
        let res = process(req, &db).await;

        let payload = serde_json::to_vec(&res)?;
        if let Some(reply) = msg.reply {
            nats.publish(reply, payload.into()).await?;
        }
    }

    Ok(())
}

async fn process(
    req: AuthValidateSessionRequest,
    db: &PgPool,
) -> AuthValidateSessionResponse {
    AuthValidateSessionResponse {
        user_id: "123".into(),
        roles: vec!["user".into()],
        valid: true,
    }
}

