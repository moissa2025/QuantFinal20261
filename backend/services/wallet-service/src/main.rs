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

    let db_url = std::env::var("DATABASE_URL")?;
    let nats_url = std::env::var("NATS_URL")?;

    let pool = init_db(&db_url).await;
    let nats = async_nats::connect(nats_url).await?;

    let state = AppState { pool, nats: nats.clone() };

    nats_handlers::start_nats_listeners(nats, state.pool.clone()).await;

    println!("wallet-service running");
    tokio::signal::ctrl_c().await?;
    Ok(())
}

