use sqlx::{Pool, Postgres};
use sqlx::postgres::PgPoolOptions;
use std::env;

pub type DbPool = Pool<Postgres>;

pub async fn init_db() -> Result<DbPool, sqlx::Error> {
    // 1. LOCAL DEVELOPMENT OVERRIDE
    if let Ok(url) = env::var("DATABASE_URL") {
        println!("📌 reconciliation-service: Using DATABASE_URL for local development");
        return PgPoolOptions::new()
            .max_connections(5)
            .connect(&url)
            .await;
    }

    // 2. CLOUD SQL PROXY MODE (Kubernetes)
    println!("📌 reconciliation-service: Using Cloud SQL Proxy environment variables");

    let user = env::var("DB_USER").expect("reconcileuser");
    let pass = env::var("DB_PASSWORD").expect("reconcileGos608eg");
    let host = env::var("DB_HOST").unwrap_or_else(|_| "127.0.0.1".into());
    let port = env::var("DB_PORT").unwrap_or_else(|_| "5432".into());
    let name = env::var("DB_NAME").expect("reconcile_db");

    let url = format!(
        "postgres://{}:{}@{}:{}/{}",
        user, pass, host, port, name
    );

    PgPoolOptions::new()
        .max_connections(5)
        .connect(&url)
        .await
}

