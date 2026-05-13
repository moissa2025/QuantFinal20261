use anyhow::Result;
use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

use common::auth_messages::{AuthLoginRequest, AuthLoginResponse};

pub async fn handle_login(nats: Client, db: PgPool) -> Result<()> {
    let mut sub = nats.subscribe("auth.login").await?;

    while let Some(msg) = sub.next().await {
        let req: AuthLoginRequest = serde_json::from_slice(&msg.payload)?;
        let res = process(req, &db).await;

        let payload = serde_json::to_vec(&res)?;
        if let Some(reply) = msg.reply {
            nats.publish(reply, payload.into()).await?;
        }
    }

    Ok(())
}

async fn process(req: AuthLoginRequest, db: &PgPool) -> AuthLoginResponse {
    // TODO: real login logic
    AuthLoginResponse {
        user_id: "123".into(),
        mfa_required: true,
        session_token: None,
        refresh_token: None,
        roles: vec!["user".into()],
        ttl_seconds: None,
    }
}

