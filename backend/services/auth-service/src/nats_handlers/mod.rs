use anyhow::Result;
use async_nats::Client;
use sqlx::PgPool;

pub mod register;
pub mod activate;
pub mod login;
pub mod refresh;
pub mod logout;
pub mod validate_session;
pub mod introspect_session;
pub mod mfa_setup;
pub mod mfa_verify;

pub async fn start_nats_listeners(nats: Client, db: PgPool) -> Result<()> {
    // REGISTER
    tokio::spawn({
        let n = nats.clone();
        let d = db.clone();
        async move {
            if let Err(e) = register::listener(n, d).await {
                tracing::error!("register listener error: {:?}", e);
            }
        }
    });

    // ACTIVATE
    tokio::spawn({
        let n = nats.clone();
        let d = db.clone();
        async move {
            if let Err(e) = activate::listener(n, d).await {
                tracing::error!("activate listener error: {:?}", e);
            }
        }
    });

    // LOGIN
    tokio::spawn({
        let n = nats.clone();
        let d = db.clone();
        async move {
            if let Err(e) = login::listener(n, d).await {
                tracing::error!("login listener error: {:?}", e);
            }
        }
    });

    // REFRESH
    tokio::spawn({
        let n = nats.clone();
        let d = db.clone();
        async move {
            if let Err(e) = refresh::listener(n, d).await {
                tracing::error!("refresh listener error: {:?}", e);
            }
        }
    });

    // LOGOUT
    tokio::spawn({
        let n = nats.clone();
        let d = db.clone();
        async move {
            if let Err(e) = logout::listener(n, d).await {
                tracing::error!("logout listener error: {:?}", e);
            }
        }
    });

    // VALIDATE SESSION
    tokio::spawn({
        let n = nats.clone();
        let d = db.clone();
        async move {
            if let Err(e) = validate_session::listener(n, d).await {
                tracing::error!("validate_session listener error: {:?}", e);
            }
        }
    });

    // INTROSPECT SESSION
    tokio::spawn({
        let n = nats.clone();
        let d = db.clone();
        async move {
            if let Err(e) = introspect_session::listener(n, d).await {
                tracing::error!("introspect_session listener error: {:?}", e);
            }
        }
    });

    // MFA SETUP  🔥🔥🔥 (the one that was missing)
    tokio::spawn({
        let n = nats.clone();
        let d = db.clone();
        async move {
            if let Err(e) = mfa_setup::listener(n, d).await {
                tracing::error!("mfa_setup listener error: {:?}", e);
            }
        }
    });

    // MFA VERIFY
    tokio::spawn({
        let n = nats.clone();
        let d = db.clone();
        async move {
            if let Err(e) = mfa_verify::listener(n, d).await {
                tracing::error!("mfa_verify listener error: {:?}", e);
            }
        }
    });

    Ok(())
}

