use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::{ActivateRequest, ActivateResponse};

pub async fn listener(nats: Client, _db: PgPool) -> Result<()> {
    // SAFE SUBSCRIBE (never crash the task)
    let mut sub = match nats.subscribe("auth.activate.request").await {
        Ok(s) => s,
        Err(e) => {
            tracing::error!("Failed to subscribe to auth.activate.request: {:?}", e);
            return Ok(()); // do NOT kill the task
        }
    };

    tracing::info!("Listening on auth.activate.request");

    while let Some(msg) = sub.next().await {
        // SAFE DESERIALIZE (never crash the task)
        let req: ActivateRequest = match serde_json::from_slice(&msg.payload) {
            Ok(r) => r,
            Err(e) => {
                tracing::error!("activate: invalid payload: {}", e);
                if let Some(reply) = msg.reply {
                    let _ = nats.publish(reply, b"{\"ok\":false}".to_vec().into()).await;
                }
                continue;
            }
        };

        let res = ActivateResponse { ok: true };

        if let Some(reply) = msg.reply {
            let payload = serde_json::to_vec(&res)?;
            let _ = nats.publish(reply, payload.into()).await;
        }
    }

    Ok(())
}

