use axum::{Router, routing::{get, post}};
use std::net::SocketAddr;
use tracing_subscriber;

mod routes;
mod workflow;
mod nats_handlers;
mod db;

use db::init_db;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();

    let pool = init_db()
        .await
        .expect("Failed to initialize database");

    let app = Router::new()
        .route("/health", get(routes::health))
        .route("/onboard", post(routes::start_onboarding))
        .with_state(pool);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}

