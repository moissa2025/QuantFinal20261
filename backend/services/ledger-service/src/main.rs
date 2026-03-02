mod db;
mod models;
mod repository;
mod nats_handlers;
use crate::db::DbPool;
use async_nats::Client;

use async_nats::connect;
use db::init_db;


pub async fn start_nats_listeners(_nats: Client, _pool: DbPool) {
    // TODO: wire up subscriptions to:
    // - ensure_account::handle_ensure_account
    // - get_balance::handle_get_balance
    // - get_history::handle_get_history
    // - record_journal::handle_record_journal
}


#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    println!("ledger-service starting…");

    let pool = init_db().await.expect("Failed to init DB");

    let nats_url = std::env::var("NATS_URL")
        .expect("NATS_URL must be set");
    let nats = connect(&nats_url).await?;

    nats_handlers::start_nats_listeners(nats, pool).await;

    Ok(())
}

