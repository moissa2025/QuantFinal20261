use axum::{
    routing::get,
    Router,
};
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::EnvFilter;

mod engine;
mod routes;
mod state;

use crate::state::AppState;

#[tokio::main]
async fn main() {
    // Logging
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    // Shared state (already Arc<AppState>)
    let state = AppState::new();

    // Build router
    let app = Router::new()
        .route("/ws/terminal", get(routes::ws::terminal_stream))
        .with_state(state) // FIXED: no clone, no semicolon
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        );

    // Bind address
    let addr = "0.0.0.0:8080";
    tracing::info!("trading-service listening on {}", addr);

    // Axum 0.7 server
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

