use axum::{Router, routing::{get, post}};
use std::net::SocketAddr;
use tracing_subscriber;

mod routes;
mod workflow;
mod nats_handlers;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let app = Router::new()
        .route("/health", get(routes::health))
        .route("/onboard", post(routes::start_onboarding));

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind");

    axum::serve(listener, app)
        .await
        .unwrap();
}

