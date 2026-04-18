mod routes;
mod models;
mod db;

use axum::{Router, routing::get};
use std::net::SocketAddr;
use tracing_subscriber;
use db::init_db;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    println!("🚨 aml-monitoring-service starting…");

    let db = init_db().await.expect("❌ Failed to connect to CockroachDB");

    let app = Router::new()
        .route("/health", get(routes::health))
        .with_state(db);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("🚀 aml-monitoring-service running on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}

