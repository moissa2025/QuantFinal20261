use axum::{Router, routing::get};
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::EnvFilter;

mod engine;
mod routes;
mod state;
mod db;

use crate::state::AppState;
use crate::db::init_db;

// --- HEALTH HANDLER ---
async fn health() -> &'static str {
    "OK"
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Logging
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    // Initialize database
    let pool = init_db()
        .await
        .expect("❌ Failed to initialize database");

    // Shared state
    let state = AppState::new(pool.clone());

    // Build router
    let app = Router::new()
        // Health endpoint (required for Kubernetes probes)
        .route("/health", get(health))

        // WebSocket endpoint
        .route("/ws/terminal", get(routes::ws::terminal_stream))

        // Shared state
        .with_state(state)

        // CORS
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        );

    // Bind address
    let addr = "0.0.0.0:8080".parse().unwrap();
    tracing::info!("🚀 trading-service listening on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}

