use sqlx::{Pool, Postgres};
use sqlx::postgres::PgPoolOptions;

async fn init_db() -> Result<Pool<Postgres>, sqlx::Error> {
    println!("📌 api-gateway: Using CockroachDB environment variables");

    let user = std::env::var("DB_USER").expect("DB_USER missing");
    let pass = std::env::var("DB_PASSWORD").unwrap_or_default();
    let host = std::env::var("DB_HOST").expect("DB_HOST missing");
    let port = std::env::var("DB_PORT").unwrap_or_else(|_| "26257".into());
    let name = std::env::var("DB_NAME").expect("DB_NAME missing");
    let sslmode = std::env::var("DB_SSLMODE").unwrap_or_else(|_| "disable".into());

    let url = if pass.is_empty() {
        format!("postgres://{}@{}:{}/{}?sslmode={}", user, host, port, name, sslmode)
    } else {
        format!("postgres://{}:{}@{}:{}/{}?sslmode={}", user, pass, host, port, name, sslmode)
    };

    println!("📌 api-gateway: Connecting to {}", url);

    PgPoolOptions::new()
        .max_connections(10)
        .connect(&url)
        .await
}

