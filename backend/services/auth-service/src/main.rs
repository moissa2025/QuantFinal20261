mod db;
mod nats_handlers;

use std::net::SocketAddr;
use axum::{extract::connect_info::IntoMakeServiceWithConnectInfo, Router};
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

mod dto;
mod models;
mod password;
mod routes;
mod session;
mod state;

use crate::state::AppState;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();

    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    // 1. Connect to NATS (raw client)
let nats = async_nats::connect("localhost:4222").await.unwrap();
let db = db::init_db().await.unwrap();

let state = AppState::new(nats.clone(), db.clone());

    // 3. Connect to DB

    // 4. Build AppState (db first, then messaging)

    // 5. Start NATS RPC listeners
nats_handlers::start_nats_listeners(nats.clone(), db.clone()).await;
    // 6. Build HTTP router
    let router: Router<AppState> = routes::router()
        .layer(CorsLayer::very_permissive());

    let app = router.with_state(state.clone());

    let make_service: IntoMakeServiceWithConnectInfo<_, SocketAddr> =
        app.into_make_service_with_connect_info::<SocketAddr>();

    let addr: SocketAddr = "0.0.0.0:9001".parse().unwrap();
    let listener = TcpListener::bind(addr).await.unwrap();

    tracing::info!("auth-service running on {}", addr);

    axum::serve(listener, make_service)
        .await
        .unwrap();

    Ok(())
}

