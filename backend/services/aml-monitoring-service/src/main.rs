use axum::{Router, routing::get};
use sqlx::{PgPool, postgres::PgPoolOptions};
use std::{env, net::SocketAddr};
use tracing_subscriber;

mod routes;
mod models;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    println!("🚨 aml-monitoring-service starting…");

    // CockroachDB Cloud ALWAYS uses DATABASE_URL.
    let db_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set for CockroachDB Cloud");

    println!("🔐 Using CockroachDB Cloud connection string");

    // Create the SQLx connection pool
    let db = PgPoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await
        .expect("❌ Failed to connect to CockroachDB");

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

