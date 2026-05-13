use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::{AuthRefreshRequest, AuthRefreshResponse};

pub async fn handle_refresh(nats: Client, db: PgPool) -> Result<()> {
   let mut sub = nats.subscribe("auth.refresh").await?;

    while let Some(msg) = sub.next().await {
        let req: AuthRefreshRequest = serde_json::from_slice(&msg.payload)?;
        let res = process(req, &db).await;

        let payload = serde_json::to_vec(&res)?;
        if let Some(reply) = msg.reply {
            nats.publish(reply, payload.into()).await?;
        }
    }

    Ok(())
}

async fn process(req: AuthRefreshRequest, db: &PgPool) -> AuthRefreshResponse {
    AuthRefreshResponse {
        user_id: "123".into(),
        session_token: "new-session".into(),
        refresh_token: "new-refresh".into(),
        roles: vec!["user".into()],
        ttl_seconds: 3600,
    }
}

