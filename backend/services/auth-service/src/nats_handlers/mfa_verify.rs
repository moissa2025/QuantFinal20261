use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::{AuthMfaVerifyRequest, AuthMfaVerifyResponse};

pub async fn listener(nats: Client, db: PgPool) -> Result<()> {
    let mut sub = nats.subscribe("auth.mfa.verify.request").await?;

    tracing::info!("Listening on auth.mfa.verify.request");

    while let Some(msg) = sub.next().await {
        let _req: AuthMfaVerifyRequest = serde_json::from_slice(&msg.payload)?;

        let res = AuthMfaVerifyResponse {
            ok: true,
            session_token: Some("session".into()),
            refresh_token: Some("refresh".into()),
            roles: vec!["user".into()],
            ttl_seconds: Some(3600),
        };

        if let Some(reply) = msg.reply {
            let payload = serde_json::to_vec(&res)?;
            nats.publish(reply, payload.into()).await?;
        }
    }

    Ok(())
}

