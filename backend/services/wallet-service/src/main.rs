mod utils;
mod routes;
mod db;
mod models;
mod repository;
mod nats_handlers;
mod state;
mod http_handlers;

use crate::utils::binance::BinanceClient;
use crate::db::init_db;
use crate::state::AppState;

use axum::{Router, routing::{get, post}};
use std::sync::Arc;
use std::net::SocketAddr;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    let nats_url = std::env::var("NATS_URL")?;

    // -------------------------------
    // ⭐ DB + NATS
    // -------------------------------
    let pool = init_db().await?;
    let nats = async_nats::connect(nats_url).await?;

    // -------------------------------
    // ⭐ Binance Client Init
    // -------------------------------
    let binance_client = Arc::new(BinanceClient::new(
        std::env::var("BINANCE_API_KEY").unwrap_or_default(),
        std::env::var("BINANCE_API_SECRET").unwrap_or_default(),
    ));

    // -------------------------------
    // ⭐ Shared App State
    // -------------------------------
    let state = Arc::new(AppState {
        pool: pool.clone(),
        nats: nats.clone(),
        binance_client: binance_client.clone(),
    });

    // -------------------------------
    // ⭐ Start NATS listeners
    // -------------------------------
    nats_handlers::start_nats_listeners(nats, state.pool.clone()).await;

    // -------------------------------
    // ⭐ HTTP ROUTER (Axum 0.6)
    // -------------------------------
    let app = Router::new()
    .route("/health", get(http_handlers::health))
    .route("/accounts", post(http_handlers::create_account))
    .route("/accounts/:id", get(http_handlers::get_balance))
    .route("/accounts/:id/credit", post(http_handlers::credit))
    .route("/accounts/:id/debit", post(http_handlers::debit))
    .route("/transfer", post(http_handlers::transfer))
    .merge(routes::binance::routes())
    .merge(routes::binance_health::routes())
    .with_state(state.clone());

    // -------------------------------
    // ⭐ HTTP SERVER (Axum 0.6)
    // -------------------------------
    let addr: SocketAddr = "0.0.0.0:8080".parse().unwrap();
    println!("wallet-service HTTP server running on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}

