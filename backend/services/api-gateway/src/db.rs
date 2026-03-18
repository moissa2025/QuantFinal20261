use sqlx::{Pool, Postgres, postgres::PgPoolOptions};
use std::env;

#[derive(Clone)]
pub struct DbPool(pub Pool<Postgres>);

impl DbPool {
    pub async fn connect_from_env() -> Result<Self, sqlx::Error> {
        // 1. LOCAL DEVELOPMENT OVERRIDE
        if let Ok(url) = env::var("DATABASE_URL") {
            println!("📌 Using DATABASE_URL for local development");
            let pool = PgPoolOptions::new()
                .max_connections(10)
                .connect(&url)
                .await?;
            return Ok(Self(pool));
        }

        // 2. COCKROACHDB MODE (Kubernetes / Cloud)
        println!("📌 Using CockroachDB environment variables");

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

        let pool = PgPoolOptions::new()
            .max_connections(10)
            .connect(&url)
            .await?;

        Ok(Self(pool))
    }
}

