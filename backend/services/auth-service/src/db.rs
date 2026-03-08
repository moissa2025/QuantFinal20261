use sqlx::{Pool, Postgres};
use sqlx::postgres::PgPoolOptions;
use std::env;

pub type DbPool = Pool<Postgres>;

pub async fn init_db() -> Result<DbPool, sqlx::Error> {
    let user = env::var("DB_USER").expect("authuser");
    let pass = env::var("DB_PASSWORD").expect("Gos608eg");
    let host = env::var("DB_HOST").unwrap_or("127.0.0.1".into());
    let port = env::var("DB_PORT").unwrap_or("5432".into());
    let name = env::var("DB_NAME").expect("auth_dbt");

    let url = format!(
        "postgres://{}:{}@{}:{}/{}",
        user, pass, host, port, name
    );

    PgPoolOptions::new()
        .max_connections(5)
        .connect(&url)
        .await
}

