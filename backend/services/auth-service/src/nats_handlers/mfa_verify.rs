use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::{AuthMfaVerifyRequest, AuthMfaVerifyResponse};

pub async fn handle_mfa_verify(nats: Client, db: PgPool) -> Result<()> {
   let mut sub = nats.subscribe("auth.mfa.verify").await?;

    while let Some(msg) = sub.next().await {
        let req: AuthMfaVerifyRequest = serde_json::from_slice(&msg.payload)?;
        let res = process(req, &db).await;

        let payload = serde_json::to_vec(&res)?;
        if let Some(reply) = msg.reply {
            nats.publish(reply, payload.into()).await?;
        }
    }

    Ok(())
}

async fn process(req: AuthMfaVerifyRequest, db: &PgPool) -> AuthMfaVerifyResponse {
    AuthMfaVerifyResponse {
        ok: true,
        session_token: Some("session".into()),
        refresh_token: Some("refresh".into()),
        roles: vec!["user".into()],
        ttl_seconds: Some(3600),
    }
}

