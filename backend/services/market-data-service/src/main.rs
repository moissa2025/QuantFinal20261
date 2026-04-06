use std::net::SocketAddr;

use axum::{
    routing::get,
    Router,
    serve,
};
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::EnvFilter;
use tokio::net::TcpListener;

mod routes;
mod state;
mod engine;

use crate::state::AppState;
use crate::engine::aggregator::run_aggregator;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let state = AppState::new();

    let agg_state = state.clone();
    tokio::spawn(async move {
        run_aggregator(agg_state).await;
    });

    let app = Router::new()
        .route("/market-data/snapshot", get(routes::rest::market_snapshot))
        .route("/market-stream", get(routes::ws::market_stream))
        .with_state(state.clone())
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        );

    let addr = SocketAddr::from(([0, 0, 0, 0], 8081));
    tracing::info!("market-data-service listening on {}", addr);

    let listener = TcpListener::bind(addr).await.unwrap();

    serve(listener, app.into_make_service())
        .await
        .unwrap();
}

