use axum::{Router, routing::get};
use sqlx::{Pool, Postgres};
use sqlx::postgres::PgPoolOptions;
use std::{env, net::SocketAddr};
use tracing_subscriber;

mod routes;
mod models;
mod nats_handlers;

#[tokio::main]
async fn main() {
    // Initialize structured logging
    tracing_subscriber::fmt::init();

    //
    // ⭐ Dual-mode DB connection:
    // Local dev → use DATABASE_URL
    // Kubernetes / Cockroach Cloud → build URL from env vars
    //
    let db_url = if let Ok(url) = env::var("DATABASE_URL") {
        println!("🔧 KYC service: Using DATABASE_URL for local development");
        url
    } else {
        println!("🔧 KYC service: Using CockroachDB environment variables");

        let user = env::var("DB_USER").expect("DB_USER missing");
        let pass = env::var("DB_PASSWORD").expect("DB_PASSWORD missing");
        let host = env::var("DB_HOST").unwrap_or_else(|_| "127.0.0.1".into());
        let port = env::var("DB_PORT").unwrap_or_else(|_| "26257".into());
        let name = env::var("DB_NAME").expect("DB_NAME missing");

        // Cockroach Cloud requires TLS unless overridden
        let sslmode = env::var("DB_SSLMODE").unwrap_or_else(|_| "require".into());

        format!(
            "postgres://{}:{}@{}:{}/{}?sslmode={}",
            user, pass, host, port, name, sslmode
        )
    };

    //
    // ⭐ Create DB connection pool
    //
    let db = PgPoolOptions::new()
        .max_connections(10)
        .connect(&db_url)
        .await
        .expect("❌ Failed to connect to CockroachDB");

    //
    // ⭐ Build Axum router
    //
    let app = Router::new()
        .route("/health", get(routes::health))
        .route("/kyc/status/:user_id", get(routes::get_kyc_status))
        .with_state(db);

    //
    // ⭐ Bind to port 8080
    //
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));

    println!("🚀 KYC service running on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("❌ Failed to bind to port");

    axum::serve(listener, app)
        .await
        .unwrap();
}

