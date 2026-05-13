use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::AuthLogoutRequest;

pub async fn handle_logout(nats: Client, db: PgPool) -> Result<()> {
  let mut sub = nats.subscribe("auth.logout").await?;

    while let Some(msg) = sub.next().await {
        let req: AuthLogoutRequest = serde_json::from_slice(&msg.payload)?;
        process(req, &db).await;

        if let Some(reply) = msg.reply {
            nats.publish(reply, b"{}".to_vec().into()).await?;
        }
    }

    Ok(())
}

async fn process(req: AuthLogoutRequest, db: &PgPool) {
    // TODO: invalidate session
}

