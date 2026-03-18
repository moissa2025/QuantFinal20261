use sqlx::{Pool, Postgres};
use sqlx::postgres::PgPoolOptions;
use std::env;

pub type DbPool = Pool<Postgres>;

pub async fn init_db() -> Result<DbPool, sqlx::Error> {
    // 1. LOCAL DEVELOPMENT OVERRIDE
    if let Ok(url) = env::var("DATABASE_URL") {
        println!("📌 auth-service: Using DATABASE_URL for local development");
        return PgPoolOptions::new()
            .max_connections(10)
            .connect(&url)
            .await;
    }

    // 2. COCKROACHDB MODE (Kubernetes / Cloud)
    println!("📌 auth-service: Using CockroachDB environment variables");

    let user = env::var("DB_USER").expect("DB_USER missing");
    let pass = env::var("DB_PASSWORD").expect("DB_PASSWORD missing");
    let host = env::var("DB_HOST").unwrap_or_else(|_| "127.0.0.1".into());
    let port = env::var("DB_PORT").unwrap_or_else(|_| "26257".into());
    let name = env::var("DB_NAME").expect("DB_NAME missing");

    // CockroachDB requires sslmode=require unless running insecure local cluster
    let sslmode = env::var("DB_SSLMODE").unwrap_or_else(|_| "require".into());

    let url = format!(
        "postgres://{}:{}@{}:{}/{}?sslmode={}",
        user, pass, host, port, name, sslmode
    );

    PgPoolOptions::new()
        .max_connections(10)
        .connect(&url)
        .await
}

