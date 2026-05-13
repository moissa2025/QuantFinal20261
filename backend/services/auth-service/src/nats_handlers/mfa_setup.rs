use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::{AuthMfaSetupRequest, AuthMfaSetupResponse};

pub async fn handle_mfa_setup(nats: Client, db: PgPool) -> Result<()> {
   let mut sub = nats.subscribe("auth.mfa.setup").await?;

    while let Some(msg) = sub.next().await {
        let req: AuthMfaSetupRequest = serde_json::from_slice(&msg.payload)?;
        let res = process(req, &db).await;

        let payload = serde_json::to_vec(&res)?;
        if let Some(reply) = msg.reply {
            nats.publish(reply, payload.into()).await?;
        }
    }

    Ok(())
}

async fn process(req: AuthMfaSetupRequest, db: &PgPool) -> AuthMfaSetupResponse {
    AuthMfaSetupResponse {
        ok: true,
        secret: Some("SECRET".into()),
        qr_code: Some("QRDATA".into()),
    }
}

