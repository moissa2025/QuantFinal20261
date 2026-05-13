use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::{ActivateRequest, ActivateResponse};

pub async fn listener(nats: Client, db: PgPool) -> Result<()> {
    let mut sub = nats.subscribe("auth.activate.request").await?;

    tracing::info!("Listening on auth.activate.request");

    while let Some(msg) = sub.next().await {
        let _req: ActivateRequest = serde_json::from_slice(&msg.payload)?;
        let res = ActivateResponse { ok: true };

        if let Some(reply) = msg.reply {
            let payload = serde_json::to_vec(&res)?;
            nats.publish(reply, payload.into()).await?;
        }
    }

    Ok(())
}

