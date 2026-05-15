use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::{AuthMfaSetupRequest, AuthMfaSetupResponse};

pub async fn listener(nats: Client, db: PgPool) -> Result<()> {
    let mut sub = nats.subscribe("auth.mfa.setup.request").await?;

    tracing::info!("Listening on auth.mfa.setup.request");

    while let Some(msg) = sub.next().await {
        let req: AuthMfaSetupRequest = match serde_json::from_slice(&msg.payload) {
    Ok(r) => r,
    Err(e) => {
        tracing::error!("mfa_setup: invalid payload: {}", e);

        if let Some(reply) = msg.reply {
            let res = AuthMfaSetupResponse {
                ok: false,
                secret: None,
                qr_code: None,
            };
            let payload = serde_json::to_vec(&res)?;
            nats.publish(reply, payload.into()).await?;
        }

        continue;
    }
};

        let res = AuthMfaSetupResponse {
            ok: true,
            secret: Some("SECRET".into()),
            qr_code: Some("QRDATA".into()),
        };

        if let Some(reply) = msg.reply {
            let payload = serde_json::to_vec(&res)?;
            nats.publish(reply, payload.into()).await?;
        }
    }

    Ok(())
}

