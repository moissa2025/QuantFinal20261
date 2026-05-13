use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::{AuthLoginRequest, AuthLoginResponse};

pub async fn listener(nats: Client, db: PgPool) -> Result<()> {
    let mut sub = nats.subscribe("auth.login.request").await?;

    tracing::info!("Listening on auth.login.request");

    while let Some(msg) = sub.next().await {
        let _req: AuthLoginRequest = serde_json::from_slice(&msg.payload)?;

        let res = AuthLoginResponse {
            user_id: "123".into(),
            mfa_required: true,
            session_token: None,
            refresh_token: None,
            roles: vec!["user".into()],
            ttl_seconds: None,
        };

        if let Some(reply) = msg.reply {
            let payload = serde_json::to_vec(&res)?;
            nats.publish(reply, payload.into()).await?;
        }
    }

    Ok(())
}

