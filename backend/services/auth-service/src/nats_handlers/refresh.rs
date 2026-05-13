use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::{AuthRefreshRequest, AuthRefreshResponse};

pub async fn listener(nats: Client, db: PgPool) -> Result<()> {
    let mut sub = nats.subscribe("auth.refresh.request").await?;

    tracing::info!("Listening on auth.refresh.request");

    while let Some(msg) = sub.next().await {
        let _req: AuthRefreshRequest = serde_json::from_slice(&msg.payload)?;

        let res = AuthRefreshResponse {
            user_id: "123".into(),
            session_token: "new-session".into(),
            refresh_token: "new-refresh".into(),
            roles: vec!["user".into()],
            ttl_seconds: 3600,
        };

        if let Some(reply) = msg.reply {
            let payload = serde_json::to_vec(&res)?;
            nats.publish(reply, payload.into()).await?;
        }
    }

    Ok(())
}

