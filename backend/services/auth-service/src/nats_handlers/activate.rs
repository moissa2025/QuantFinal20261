use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::{ActivateRequest, ActivateResponse};

pub async fn handle_activate(nats: Client, db: PgPool) -> Result<()> {
    let mut sub = nats.subscribe("auth.activate").await?;

    while let Some(msg) = sub.next().await {
        let req: ActivateRequest = serde_json::from_slice(&msg.payload)?;
        let res = process(req, &db).await;

        let payload = serde_json::to_vec(&res)?;
        if let Some(reply) = msg.reply {
            nats.publish(reply, payload.into()).await?;
        }
    }

    Ok(())
}

async fn process(req: ActivateRequest, db: &PgPool) -> ActivateResponse {
    // TODO: implement activation logic
    ActivateResponse { ok: true }
}

