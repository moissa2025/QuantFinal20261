mod handlers;
mod db;
mod dto;
mod models;
mod password;
mod routes;
mod session;
mod state;
mod nats_handlers;
mod crypto; // for encrypted refresh tokens

use std::net::SocketAddr;

use axum::{
    extract::connect_info::IntoMakeServiceWithConnectInfo,
    Router,
};
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

use crate::state::AppState;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Load .env if present
    dotenvy::dotenv().ok();

    // Initialise tracing
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    //
    // 1. Connect to NATS
    //
    // 1. Connect to NATS
    let nats_url = std::env::var("NATS_URL")
    	.unwrap_or_else(|_| "nats://nats.trading-platform.svc.cluster.local:4222".to_string());

    let nats = async_nats::connect(&nats_url)
    	.await
    	.expect("failed to connect to NATS");

    //
    // 2. Connect to Postgres
    //
    let db = db::init_db()
        .await
        .expect("failed to connect to database");

    //
    // 3. Build shared AppState
    //
    let state = AppState::new(nats.clone(), db.clone());

    //
    // 4. Start NATS RPC listeners
    //
    nats_handlers::start_nats_listeners(nats.clone(), db.clone()).await;

    //
    // 5. Build HTTP router
    //
    let router: Router<AppState> = routes::router()
        .layer(CorsLayer::very_permissive());

    let app = router.with_state(state.clone());

    //
    // 6. Bind TCP listener
    //
    let addr: SocketAddr = "0.0.0.0:9001".parse().unwrap();
    let listener = TcpListener::bind(addr)
        .await
        .expect("failed to bind TCP listener");

    tracing::info!("auth-service running on {}", addr);

    //
    // 7. Serve HTTP with ConnectInfo
    //
    let make_service: IntoMakeServiceWithConnectInfo<_, SocketAddr> =
        app.into_make_service_with_connect_info::<SocketAddr>();

    axum::serve(listener, make_service)
        .await
        .expect("server error");

    Ok(())
}

