mod state;
mod nats_client;
mod dto;
mod services;
mod handlers;
mod nats_handlers;

use std::sync::Arc;
use tracing_subscriber::EnvFilter;
use state::AppState;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_target(false)
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    // Build AppState (DB + NATS)
    let state = Arc::new(AppState::new().await?);

    // Register NATS handlers
    nats_handlers::register_nats_handlers(state.clone()).await?;

    println!("🚀 intelligence-service running");

    // Keep alive
    loop {
        tokio::time::sleep(std::time::Duration::from_secs(3600)).await;
    }
}

