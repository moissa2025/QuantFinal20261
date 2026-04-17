mod db;
mod models;
mod repository;
mod nats_handlers;

use axum::{Router, routing::get, serve};
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::EnvFilter;

use crate::db::{DbPool, init_db};
use async_nats::connect;
use tokio::net::TcpListener;

// --- HEALTH HANDLER ---
async fn health() -> &'static str {
    "OK"
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    println!("ledger-service starting…");

    // Initialize DB
    let pool = init_db()
        .await
        .expect("Failed to init DB");

    // Connect to NATS
    let nats_url = std::env::var("NATS_URL")
        .expect("NATS_URL must be set");

    let nats = connect(&nats_url).await?;

    // Start NATS listeners (non-blocking)
    tokio::spawn({
        let pool = pool.clone();
        let nats = nats.clone();
        async move {
            nats_handlers::start_nats_listeners(nats, pool).await;
        }
    });

    // Build Axum router
    let app = Router::new()
        .route("/health", get(health))
        .with_state(pool.clone())
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        );

    // Axum 0.7 server (Hyper under the hood)
    let addr = "0.0.0.0:8080";
    let listener = TcpListener::bind(addr).await?;
    tracing::info!("🚀 ledger-service listening on {}", addr);

    serve(listener, app).await?;

    Ok(())
}

