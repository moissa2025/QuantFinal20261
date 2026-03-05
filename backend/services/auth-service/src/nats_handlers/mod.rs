use async_nats::Client;
use futures_util::StreamExt;

use crate::db::DbPool;

mod login;
mod refresh;
mod logout;
mod validate_session;

pub use login::handle_login;
pub use refresh::handle_refresh;
pub use logout::handle_logout;
pub use validate_session::handle_validate_session;

pub async fn start_nats_listeners(nats: Client, pool: DbPool) {
    // Rename incoming pool to a conventional variable name
    let db_pool = pool;

    //
    // LOGIN
    //
    {
        let mut sub = nats.subscribe("auth.login.request").await.unwrap();
        let nats = nats.clone();
        let db_pool = db_pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let db_pool = db_pool.clone();
                tokio::spawn(async move {
                    handle_login(db_pool, nats, msg).await;
                });
            }
        });
    }

    //
    // REFRESH
    //
    {
        let mut sub = nats.subscribe("auth.refresh.request").await.unwrap();
        let nats = nats.clone();
        let db_pool = db_pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let db_pool = db_pool.clone();
                tokio::spawn(async move {
                    handle_refresh(db_pool, nats, msg).await;
                });
            }
        });
    }

    //
    // VALIDATE SESSION
    //
    {
        let mut sub = nats.subscribe("auth.validate_session.request").await.unwrap();
        let nats = nats.clone();
        let db_pool = db_pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let db_pool = db_pool.clone();
                tokio::spawn(async move {
                handle_validate_session(db_pool, nats, msg).await;
		});
            }
        });
    }

    //
    // LOGOUT
    //
    {
        let mut sub = nats.subscribe("auth.logout.request").await.unwrap();
        let nats = nats.clone();
        let db_pool = db_pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let db_pool = db_pool.clone();
                tokio::spawn(async move {
                    handle_logout(db_pool, nats, msg).await;
                });
            }
        });
    }
}

