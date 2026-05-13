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

    tracing::info!("auth-service: connected to DB and NATS, starting listeners...");

    // Start NATS listeners in background
    tokio::spawn({
        let nats = nats.clone();
        let db = db.clone();
        async move {
            nats_handlers::start_nats_listeners(nats, db).await;
        }
    });

    // Keep service alive forever
    loop {
        tokio::time::sleep(std::time::Duration::from_secs(3600)).await;
    }

    // (unreachable)
    // Ok(())
}

