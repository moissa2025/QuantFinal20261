use axum::{Router, routing::get};
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::EnvFilter;

mod engine;
mod routes;
mod state;
mod db;

use crate::state::AppState;
use crate::db::init_db;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Logging
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    // Initialize database (dual mode: DATABASE_URL or Cloud SQL Proxy)
    let pool = init_db()
        .await
        .expect("❌ Failed to initialize database");

    // Shared state (now includes DB pool)
    let state = AppState::new(pool.clone());

    // Build router
    let app = Router::new()
        .route("/ws/terminal", get(routes::ws::terminal_stream))
        .with_state(state)
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        );

    // Bind address
    let addr = "0.0.0.0:8080";
    tracing::info!("🚀 trading-service listening on {}", addr);

    // Axum 0.7 server
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}

