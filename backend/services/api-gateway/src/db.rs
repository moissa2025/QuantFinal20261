use sqlx::{Pool, Postgres, postgres::PgPoolOptions};
use std::env;

#[derive(Clone)]
pub struct DbPool(pub Pool<Postgres>);

impl DbPool {
    pub async fn connect_from_env() -> Result<Self, sqlx::Error> {
        // 1. LOCAL DEVELOPMENT OVERRIDE
        // If DATABASE_URL is set, always use it.
        if let Ok(url) = env::var("DATABASE_URL") {
            println!("📌 Using DATABASE_URL for local development");
            let pool = PgPoolOptions::new()
                .max_connections(5)
                .connect(&url)
                .await?;
            return Ok(Self(pool));
        }

        // 2. CLOUD SQL PROXY MODE (Kubernetes)
        println!("📌 Using Cloud SQL Proxy environment variables");

        let user = env::var("DB_USER").expect("apiuser");
        let pass = env::var("DB_PASSWORD").expect("apiGos608eg");
        let host = env::var("DB_HOST").unwrap_or_else(|_| "127.0.0.1".into());
        let port = env::var("DB_PORT").unwrap_or_else(|_| "5432".into());
        let name = env::var("DB_NAME").expect("apgw_db");

        let url = format!(
            "postgres://{}:{}@{}:{}/{}",
            user, pass, host, port, name
        );

        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(&url)
            .await?;

        Ok(Self(pool))
    }
}

