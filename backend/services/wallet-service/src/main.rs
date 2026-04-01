mod db;
mod models;
mod repository;
mod nats_handlers;
mod state;
mod http_handlers;

use crate::db::init_db;
use crate::state::AppState;
use axum::{Router, routing::{get, post}};
use std::sync::Arc;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    let nats_url = std::env::var("NATS_URL")?;

    let pool = init_db().await?;
    let nats = async_nats::connect(nats_url).await?;

    let state = Arc::new(AppState {
        pool: pool.clone(),
        nats: nats.clone(),
    });

    // Start NATS listeners
    nats_handlers::start_nats_listeners(nats, state.pool.clone()).await;

    // -------------------------------
    // ⭐ HTTP ROUTER
    // -------------------------------
    let app = Router::new()
        .route("/health", get(http_handlers::health))
        .route("/accounts", post(http_handlers::create_account))
        .route("/accounts/:id", get(http_handlers::get_balance))
        .with_state(state);

    // -------------------------------
    // ⭐ HTTP SERVER (CRITICAL FIX)
    // -------------------------------
    let listener = TcpListener::bind("0.0.0.0:8080").await?;
    println!("wallet-service HTTP server running on 0.0.0.0:8080");

    axum::serve(listener, app).await?;

    Ok(())
}

