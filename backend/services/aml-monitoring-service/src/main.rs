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

    // Dual-mode DB connection:
    // Local dev → DATABASE_URL
    // Kubernetes → Cloud SQL Proxy env vars
    let db_url = if let Ok(url) = env::var("DATABASE_URL") {
        println!("Using DATABASE_URL for local development");
        url
    } else {
        println!("Using Cloud SQL Proxy env vars for Kubernetes");

        let user = env::var("DB_USER").expect("amluser");
        let pass = env::var("DB_PASSWORD").expect("amlGos608eg");
        let host = env::var("DB_HOST").unwrap_or_else(|_| "127.0.0.1".into());
        let port = env::var("DB_PORT").unwrap_or_else(|_| "5432".into());
        let name = env::var("DB_NAME").expect("aml_db");

        format!("postgres://{}:{}@{}:{}/{}", user, pass, host, port, name)
    };

    let db = PgPoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await
        .expect("❌ Failed to connect to DB");

    let app = Router::new()
        .route("/health", get(routes::health))
        .with_state(db);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("🚀 aml-monitoring-service running on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind");

    axum::serve(listener, app).await.unwrap();

    Ok(())
}

