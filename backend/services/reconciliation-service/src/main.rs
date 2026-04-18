mod db;

use axum::{Router, routing::get};
use std::net::SocketAddr;
use db::init_db;

async fn health() -> &'static str {
    "OK"
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    println!("reconciliation-service starting…");

    let pool = init_db()
        .await
        .expect("Failed to initialize database");

    let app = Router::new()
        .route("/health", get(health))
        .with_state(pool);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("reconciliation-service running on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}

