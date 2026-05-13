use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::{RegisterRequest, RegisterResponse};
use common::messaging::Messaging;

pub async fn handle_register(nats: Client, db: PgPool) -> Result<()> {
  let mut sub = nats.subscribe("auth.activate").await?;

    while let Some(msg) = sub.next().await {
        let req: RegisterRequest = serde_json::from_slice(&msg.payload)?;
        let res = process(req, &db).await;

        let payload = serde_json::to_vec(&res)?;
        if let Some(reply) = msg.reply {
            nats.publish(reply, payload.into()).await?;
        }
    }

    Ok(())
}

async fn process(req: RegisterRequest, db: &PgPool) -> RegisterResponse {
    // TODO: implement real DB logic
    RegisterResponse {
        user_id: "123".into(),
        requires_activation: true,
    }
}

