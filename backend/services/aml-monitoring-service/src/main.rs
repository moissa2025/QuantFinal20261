use axum::{Router, routing::get};
use std::{env, net::SocketAddr};
use tracing_subscriber;
use sqlx::{Pool, Postgres};
use sqlx::postgres::PgPoolOptions;

mod routes;
mod models;

async fn init_db() -> Result<Pool<Postgres>, sqlx::Error> {
    if let Ok(url) = env::var("LOCAL_DATABASE_URL") {
        println!("📌 Using LOCAL_DATABASE_URL");
        return PgPoolOptions::new()
            .max_connections(10)
            .connect(&url)
            .await;
    }

    println!("📌 Using CockroachDB environment variables");

    let user = env::var("DB_USER").expect("DB_USER missing");
    let pass = env::var("DB_PASSWORD").unwrap_or_default();
    let host = env::var("DB_HOST").expect("DB_HOST missing");
    let port = env::var("DB_PORT").unwrap_or_else(|_| "26257".into());
    let name = env::var("DB_NAME").expect("DB_NAME missing");
    let sslmode = env::var("DB_SSLMODE").unwrap_or_else(|_| "disable".into());

    let url = if pass.is_empty() {
        format!("postgres://{}@{}:{}/{}?sslmode={}", user, host, port, name, sslmode)
    } else {
        format!("postgres://{}:{}@{}:{}/{}?sslmode={}", user, pass, host, port, name, sslmode)
    };

    PgPoolOptions::new()
        .max_connections(10)
        .connect(&url)
        .await
}

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

