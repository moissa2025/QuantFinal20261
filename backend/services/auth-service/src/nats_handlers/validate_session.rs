use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::{AuthValidateSessionRequest, AuthValidateSessionResponse};

pub async fn listener(nats: Client, db: PgPool) -> Result<()> {
    let mut sub = nats.subscribe("auth.validate_session.request").await?;

    tracing::info!("Listening on auth.validate_session.request");

    while let Some(msg) = sub.next().await {
        let _req: AuthValidateSessionRequest = serde_json::from_slice(&msg.payload)?;

        let res = AuthValidateSessionResponse {
            user_id: "123".into(),
            roles: vec!["user".into()],
            valid: true,
        };

        if let Some(reply) = msg.reply {
            let payload = serde_json::to_vec(&res)?;
            nats.publish(reply, payload.into()).await?;
        }
    }

    Ok(())
}

