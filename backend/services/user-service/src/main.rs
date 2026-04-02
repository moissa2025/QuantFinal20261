mod db;
mod models;
mod repository;
mod nats_handlers;
mod state;

use async_nats::connect;
use db::init_db;
use std::net::SocketAddr;

use axum::{Router, routing::get};

mod http;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();

    let pool = init_db().await.expect("Failed to init DB");

    let nats_url = std::env::var("NATS_URL").expect("NATS_URL must be set");
    let nats = connect(&nats_url).await.unwrap();

    {
        let pool_clone = pool.clone();
        let nats_clone = nats.clone();
        tokio::spawn(async move {
            nats_handlers::start_nats_listeners(nats_clone, pool_clone).await;
        });
    }

    // HTTP ROUTES
    let app = Router::new()
        .route("/health", get(|| async { "OK" }))
        .nest("/", http::routes(pool.clone()));

    let addr: SocketAddr = "0.0.0.0:8080".parse().unwrap();
    println!("HTTP server running on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}

