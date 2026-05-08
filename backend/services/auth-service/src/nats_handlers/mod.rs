pub mod login;
pub mod logout;
pub mod refresh;
pub mod validate_session;
pub mod introspect_session;
pub mod mfa_verify;
pub mod mfa_setup;

pub mod register;
pub mod activate;

use async_nats::Client;
use sqlx::PgPool;

use register::handle_register;
use activate::handle_activate;
use login::handle_login;
use logout::handle_logout;
use refresh::handle_refresh;
use validate_session::handle_validate_session;
use mfa_verify::handle_mfa_verify;
use mfa_setup::handle_mfa_setup;
use introspect_session::handle_introspect_session;

pub async fn start_nats_listeners(nats: Client, db: PgPool) {
    // REGISTER
    {
        let sub = nats.subscribe("auth.register.request".into()).await.unwrap();
        let db = db.clone();
        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                handle_register(msg, db.clone()).await;
            }
        });
    }

    // ACTIVATE
    {
        let sub = nats.subscribe("auth.activate.request".into()).await.unwrap();
        let db = db.clone();
        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                handle_activate(msg, db.clone()).await;
            }
        });
    }

    // LOGIN
    {
        let sub = nats.subscribe("auth.login.request".into()).await.unwrap();
        let db = db.clone();
        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                handle_login(msg, db.clone()).await;
            }
        });
    }

    // REFRESH
    {
        let sub = nats.subscribe("auth.refresh.request".into()).await.unwrap();
        let db = db.clone();
        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                handle_refresh(msg, db.clone()).await;
            }
        });
    }

    // VALIDATE SESSION
    {
        let sub = nats.subscribe("auth.validate_session.request".into()).await.unwrap();
        let db = db.clone();
        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                handle_validate_session(msg, db.clone()).await;
            }
        });
    }

    // LOGOUT
    {
        let sub = nats.subscribe("auth.logout.request".into()).await.unwrap();
        let db = db.clone();
        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                handle_logout(msg, db.clone()).await;
            }
        });
    }

    // MFA VERIFY
    {
        let sub = nats.subscribe("auth.mfa.verify.request".into()).await.unwrap();
        let db = db.clone();
        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                handle_mfa_verify(msg, db.clone()).await;
            }
        });
    }

    // MFA SETUP
    {
        let sub = nats.subscribe("auth.mfa.setup.request".into()).await.unwrap();
        let db = db.clone();
        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                handle_mfa_setup(msg, db.clone()).await;
            }
        });
    }

    // INTROSPECT SESSION
    {
        let sub = nats.subscribe("auth.session.introspect.request".into()).await.unwrap();
        let db = db.clone();
        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                handle_introspect_session(msg, db.clone()).await;
            }
        });
    }
}

