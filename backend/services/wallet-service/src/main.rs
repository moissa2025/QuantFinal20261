mod db;
mod models;
mod repository;
mod nats_handlers;
mod state;

use crate::db::init_db;
use crate::state::AppState;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    // DATABASE_URL is still read here, but init_db() no longer takes it as an argument
    let _db_url = std::env::var("DATABASE_URL")?;
    let nats_url = std::env::var("NATS_URL")?;

    // ✅ FIX APPLIED — init_db takes NO arguments
    let pool = init_db().await?;

    let nats = async_nats::connect(nats_url).await?;

    let state = AppState {
        pool: pool.clone(),
        nats: nats.clone(),
    };

    nats_handlers::start_nats_listeners(nats, state.pool.clone()).await;

    println!("wallet-service running");
    tokio::signal::ctrl_c().await?;
    Ok(())
}

