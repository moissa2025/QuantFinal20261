use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::AuthLogoutRequest;

pub async fn listener(nats: Client, db: PgPool) -> Result<()> {
    let mut sub = nats.subscribe("auth.logout.request").await?;

    tracing::info!("Listening on auth.logout.request");

    while let Some(msg) = sub.next().await {
        let _req: AuthLogoutRequest = serde_json::from_slice(&msg.payload)?;

        if let Some(reply) = msg.reply {
            nats.publish(reply, b"{}".to_vec().into()).await?;
        }
    }

    Ok(())
}

