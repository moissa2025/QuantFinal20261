pub mod register;
pub mod activate;
pub mod login;
pub mod refresh;
pub mod validate_session;
pub mod logout;
pub mod mfa_verify;
pub mod mfa_setup;

use async_nats::Client;
use futures_util::StreamExt;
use sqlx::PgPool;

pub async fn start_nats_listeners(nats: Client, db: PgPool) {
    tokio::spawn(register::listener(nats.clone(), db.clone()));
    tokio::spawn(activate::listener(nats.clone(), db.clone()));
    tokio::spawn(login::listener(nats.clone(), db.clone()));
    tokio::spawn(refresh::listener(nats.clone(), db.clone()));
    tokio::spawn(validate_session::listener(nats.clone(), db.clone()));
    tokio::spawn(logout::listener(nats.clone(), db.clone()));
    tokio::spawn(mfa_verify::listener(nats.clone(), db.clone()));
    tokio::spawn(mfa_setup::listener(nats.clone(), db.clone()));

    tracing::info!("auth-service: all NATS listeners spawned");
}

