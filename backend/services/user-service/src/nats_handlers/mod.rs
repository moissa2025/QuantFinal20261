use async_nats::Client;
use futures_util::StreamExt;
pub mod response;

use crate::db::DbPool;

mod create_user;
mod get_user;
mod update_user;

pub use create_user::handle_create_user;
pub use get_user::handle_get_user;
pub use update_user::handle_update_user;

pub async fn start_nats_listeners(nats: Client, pool: DbPool) {
    let db_pool = pool;

    // USER.CREATE
    {
        let mut sub = nats.subscribe("user.create.request").await.unwrap();
        let nats = nats.clone();
        let db_pool = db_pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let db_pool = db_pool.clone();
                tokio::spawn(async move {
                    handle_create_user(db_pool, nats, msg).await;
                });
            }
        });
    }

    // USER.GET
    {
        let mut sub = nats.subscribe("user.get.request").await.unwrap();
        let nats = nats.clone();
        let db_pool = db_pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let db_pool = db_pool.clone();
                tokio::spawn(async move {
                    handle_get_user(db_pool, nats, msg).await;
                });
            }
        });
    }

    // USER.UPDATE
    {
        let mut sub = nats.subscribe("user.update.request").await.unwrap();
        let nats = nats.clone();
        let db_pool = db_pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let db_pool = db_pool.clone();
                tokio::spawn(async move {
                    handle_update_user(db_pool, nats, msg).await;
                });
            }
        });
    }
}

