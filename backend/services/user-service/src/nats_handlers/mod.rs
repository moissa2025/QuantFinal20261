use async_nats::Client;
use futures_util::StreamExt;

use crate::db::DbPool;

// --- MODULE DECLARATIONS ---
mod create_user;
mod get_user;
mod update_user;
mod update_profile;
mod update_preferences;
mod audit_log;

mod assign_role;
mod get_user_roles;
mod query_audit;

pub mod response;

// --- PUBLIC EXPORTS ---
pub use create_user::handle_create_user;
pub use get_user::handle_get_user;
pub use update_user::handle_update_user;
pub use update_profile::handle_update_profile;
pub use update_preferences::handle_update_preferences;
pub use audit_log::handle_audit_log;

pub use assign_role::handle_assign_role;
pub use get_user_roles::handle_get_user_roles;
pub use query_audit::handle_query_audit;

// --- NATS LISTENERS ---
pub async fn start_nats_listeners(nats: Client, pool: DbPool) {

    // USER.CREATE
    {
        let mut sub = nats.subscribe("user.create.request").await.unwrap();
        let nats = nats.clone();
        let pool = pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let pool = pool.clone();
                tokio::spawn(async move {
                    handle_create_user(pool, nats, msg).await;
                });
            }
        });
    }

    // USER.GET
    {
        let mut sub = nats.subscribe("user.get.request").await.unwrap();
        let nats = nats.clone();
        let pool = pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let pool = pool.clone();
                tokio::spawn(async move {
                    handle_get_user(pool, nats, msg).await;
                });
            }
        });
    }

    // USER.UPDATE
    {
        let mut sub = nats.subscribe("user.update.request").await.unwrap();
        let nats = nats.clone();
        let pool = pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let pool = pool.clone();
                tokio::spawn(async move {
                    handle_update_user(pool, nats, msg).await;
                });
            }
        });
    }

    // USER.PROFILE.UPDATE
    {
        let mut sub = nats.subscribe("user.profile.update").await.unwrap();
        let nats = nats.clone();
        let pool = pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let pool = pool.clone();
                tokio::spawn(async move {
                    handle_update_profile(pool, nats, msg).await;
                });
            }
        });
    }

    // USER.PREFERENCES.UPDATE
    {
        let mut sub = nats.subscribe("user.preferences.update").await.unwrap();
        let nats = nats.clone();
        let pool = pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let pool = pool.clone();
                tokio::spawn(async move {
                    handle_update_preferences(pool, nats, msg).await;
                });
            }
        });
    }

    // USER.AUDIT.LOG
    {
        let mut sub = nats.subscribe("user.audit.log").await.unwrap();
        let nats = nats.clone();
        let pool = pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let pool = pool.clone();
                tokio::spawn(async move {
                    handle_audit_log(pool, nats, msg).await;
                });
            }
        });
    }

    // USER.ROLE.ASSIGN
    {
        let mut sub = nats.subscribe("user.role.assign").await.unwrap();
        let nats = nats.clone();
        let pool = pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let pool = pool.clone();
                tokio::spawn(async move {
                    handle_assign_role(pool, nats, msg).await;
                });
            }
        });
    }

    // USER.ROLES.GET
    {
        let mut sub = nats.subscribe("user.roles.get").await.unwrap();
        let nats = nats.clone();
        let pool = pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let pool = pool.clone();
                tokio::spawn(async move {
                    handle_get_user_roles(pool, nats, msg).await;
                });
            }
        });
    }

    // USER.AUDIT.QUERY
    {
        let mut sub = nats.subscribe("user.audit.query").await.unwrap();
        let nats = nats.clone();
        let pool = pool.clone();

        tokio::spawn(async move {
            while let Some(msg) = sub.next().await {
                let nats = nats.clone();
                let pool = pool.clone();
                tokio::spawn(async move {
                    handle_query_audit(pool, nats, msg).await;
                });
            }
        });
    }
}

