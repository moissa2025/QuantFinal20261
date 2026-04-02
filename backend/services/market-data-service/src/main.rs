use std::net::SocketAddr;

use axum::{
    routing::get,
    Router,
};
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::EnvFilter;

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

    // AppState::new() returns Arc<AppState>
    let state = AppState::new();

    // Spawn aggregator
    let agg_state = state.clone();
    tokio::spawn(async move {
        run_aggregator(agg_state).await;
    });

    // Router<Arc<AppState>>
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

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

