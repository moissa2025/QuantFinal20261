use sqlx::{Pool, Postgres};
use sqlx::postgres::PgPoolOptions;
use std::env;

pub type DbPool = Pool<Postgres>;

pub async fn init_db() -> Result<DbPool, sqlx::Error> {
    println!("📌 wallet-service: Initialising CockroachDB connection");

    let user = env::var("DB_USER").expect("DB_USER missing");
    let pass = env::var("DB_PASSWORD").unwrap_or_default();
    let host = env::var("DB_HOST").expect("DB_HOST missing");
    let port = env::var("DB_PORT").unwrap_or_else(|_| "26257".into());
    let name = env::var("DB_NAME").expect("DB_NAME missing");
    let sslmode = env::var("DB_SSLMODE").unwrap_or_else(|_| "disable".into());

    // Build URL correctly depending on password
    let url = if pass.is_empty() {
        format!("postgres://{}@{}:{}/{}?sslmode={}", user, host, port, name, sslmode)
    } else {
        format!("postgres://{}:{}@{}:{}/{}?sslmode={}", user, pass, host, port, name, sslmode)
    };

    println!("📌 wallet-service: Connecting to {}", url);

    PgPoolOptions::new()
        .max_connections(10)
        .connect(&url)
        .await
}

