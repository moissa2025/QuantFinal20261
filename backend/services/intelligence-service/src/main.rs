mod state;
mod nats_client;
mod dto;
mod services;
mod handlers;
mod nats_handlers;

use std::sync::Arc;
use tracing_subscriber::EnvFilter;
use state::AppState;
use tokio::signal::unix::{signal, SignalKind};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_target(false)
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    println!("📌 intelligence-service: initializing state…");

    // Initialise shared state
    let state = Arc::new(AppState::new().await?);

    // Register NATS handlers
    nats_handlers::register_nats_handlers(state.clone()).await?;

    println!("🚀 intelligence-service running");

    // --- GRACEFUL SHUTDOWN HANDLER ---
    // Kubernetes sends SIGTERM when terminating a pod.
    let mut term_signal = signal(SignalKind::terminate())?;

    tokio::select! {
        // This branch keeps the service alive indefinitely
        _ = async {
            loop {
                tokio::time::sleep(std::time::Duration::from_secs(3600)).await;
            }
        } => {},

        // This branch triggers when Kubernetes sends SIGTERM
        _ = term_signal.recv() => {
            println!("⚠️  SIGTERM received — shutting down intelligence-service gracefully…");
        }
    }

    println!("🛑 intelligence-service shutdown complete");
    Ok(())
}

