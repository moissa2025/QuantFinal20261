use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::{RegisterRequest, RegisterResponse};

pub async fn listener(nats: Client, db: PgPool) -> Result<()> {
    let mut sub = nats.subscribe("auth.register.request").await?;

    tracing::info!("Listening on auth.register.request");

    while let Some(msg) = sub.next().await {
        let _req: RegisterRequest = serde_json::from_slice(&msg.payload)?;

        let res = RegisterResponse {
            user_id: "123".into(),
            requires_activation: true,
        };

        if let Some(reply) = msg.reply {
            let payload = serde_json::to_vec(&res)?;
            nats.publish(reply, payload.into()).await?;
        }
    }

    Ok(())
}

