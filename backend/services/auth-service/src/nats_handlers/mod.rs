use async_nats::Client;
use crate::db::DbPool;

// Required for sub.next().await
use futures_util::StreamExt;

mod login;
mod refresh;
mod logout;
mod mfa_setup;
mod mfa_verify;
mod introspect_session;

pub async fn start_nats_listeners(nats: Client, pool: DbPool) {
    //
    // LOGIN
    //
    {
        let pool = pool.clone();
        let nats = nats.clone();
        tokio::spawn(async move {
            let mut sub = nats.subscribe("auth.login").await.unwrap();
            while let Some(msg) = sub.next().await {
                login::handle_login(pool.clone(), nats.clone(), msg).await;
            }
        });
    }

    //
    // REFRESH
    //
    {
        let pool = pool.clone();
        let nats = nats.clone();
        tokio::spawn(async move {
            let mut sub = nats.subscribe("auth.refresh").await.unwrap();
            while let Some(msg) = sub.next().await {
                refresh::handle_refresh(pool.clone(), nats.clone(), msg).await;
            }
        });
    }

    //
    // LOGOUT
    //
    {
        let pool = pool.clone();
        let nats = nats.clone();
        tokio::spawn(async move {
            let mut sub = nats.subscribe("auth.logout").await.unwrap();
            while let Some(msg) = sub.next().await {
                logout::handle_logout(pool.clone(), nats.clone(), msg).await;
            }
        });
    }

    //
    // MFA SETUP
    //
    {
        let pool = pool.clone();
        let nats = nats.clone();
        tokio::spawn(async move {
            let mut sub = nats.subscribe("auth.mfa.setup").await.unwrap();
            while let Some(msg) = sub.next().await {
                mfa_setup::handle_mfa_setup(pool.clone(), nats.clone(), msg).await;
            }
        });
    }

    //
    // MFA VERIFY
    //
    {
        let pool = pool.clone();
        let nats = nats.clone();
        tokio::spawn(async move {
            let mut sub = nats.subscribe("auth.mfa.verify").await.unwrap();
            while let Some(msg) = sub.next().await {
                mfa_verify::handle_mfa_verify(pool.clone(), nats.clone(), msg).await;
            }
        });
    }

    //
    // SESSION INTROSPECTION
    //
    {
        let pool = pool.clone();
        let nats = nats.clone();
        tokio::spawn(async move {
            let mut sub = nats.subscribe("auth.session.introspect").await.unwrap();
            while let Some(msg) = sub.next().await {
                introspect_session::handle_introspect_session(pool.clone(), nats.clone(), msg).await;
            }
        });
    }
}

