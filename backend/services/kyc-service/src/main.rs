use axum::{Router, routing::get};
use sqlx::{PgPool, postgres::PgPoolOptions};
use std::{env, net::SocketAddr};
use tracing_subscriber;

mod routes;
mod models;
mod nats_handlers;

#[tokio::main]
async fn main() {
    // Initialize structured logging
    tracing_subscriber::fmt::init();

    // ⭐ Dual-mode DB connection:
    // Local dev → use DATABASE_URL
    // Kubernetes → build URL from Cloud SQL Proxy env vars
    let db_url = if let Ok(url) = env::var("DATABASE_URL") {
        println!("🔧 Using DATABASE_URL for local development");
        url
    } else {
        println!("🔧 Using Cloud SQL Proxy env vars for Kubernetes");

        let user = env::var("DB_USER").expect("DB_USER must be set");
        let pass = env::var("DB_PASSWORD").expect("DB_PASSWORD must be set");
        let host = env::var("DB_HOST").unwrap_or_else(|_| "127.0.0.1".into());
        let port = env::var("DB_PORT").unwrap_or_else(|_| "5432".into());
        let name = env::var("DB_NAME").expect("DB_NAME must be set");

        format!("postgres://{}:{}@{}:{}/{}", user, pass, host, port, name)
    };

    // Create DB connection pool
    let db = PgPoolOptions::new()
        .max_connections(5)
        .connect(&db_url)
        .await
        .expect("❌ Failed to connect to DB");

    // Build Axum router
    let app = Router::new()
        .route("/health", get(routes::health))
        .route("/kyc/status/:user_id", get(routes::get_kyc_status))
        .with_state(db);

    // Bind to port 8080
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));

    println!("🚀 KYC service running on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("❌ Failed to bind to port");

    axum::serve(listener, app)
        .await
        .unwrap();
}

