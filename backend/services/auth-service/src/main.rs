mod db;
mod crypto;
mod password;
mod session;
mod nats_handlers;
mod models;
mod state;

use sqlx::postgres::PgPoolOptions;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    // DB pool
    let db = PgPoolOptions::new()
        .max_connections(10)
        .connect(&std::env::var("DATABASE_URL")?)
        .await?;

    // NATS client
    let nats = async_nats::connect(&std::env::var("NATS_URL")?).await?;

    // Start NATS listeners
    nats_handlers::start_nats_listeners(nats, db).await;

    // Keep service alive
    std::future::pending::<()>().await;

    // unreachable, but required for return type
    #[allow(unreachable_code)]
    Ok(())
}

