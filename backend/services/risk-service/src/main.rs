use std::net::SocketAddr;
use axum::{Router, routing::{get, post}};
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::EnvFilter;

mod routes;
mod db;

use db::init_db;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Structured logging
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    // Initialize database
    let pool = init_db()
        .await
        .expect("❌ Failed to initialize database");

    // Router with DB state
    let app = Router::new()
        .route("/risk/check", post(routes::check_risk))
        .route("/health", get(|| async { "OK" }))
        .with_state(pool)
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        );

    // Bind and serve (Axum 0.6)
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::info!("🚀 risk-service listening on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}

