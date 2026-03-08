use sqlx::{Pool, Postgres, postgres::PgPoolOptions};
use std::env;

#[derive(Clone)]
pub struct DbPool(pub Pool<Postgres>);

impl DbPool {
    pub async fn connect_from_env() -> Result<Self, sqlx::Error> {
        // Read env vars (works locally + in GKE)
        let user = env::var("DB_USER").expect("apiuser");
        let pass = env::var("DB_PASSWORD").expect("apiGos608eg");
        let host = env::var("DB_HOST").unwrap_or_else(|_| "127.0.0.1".into());
        let port = env::var("DB_PORT").unwrap_or_else(|_| "5432".into());
        let name = env::var("DB_NAME").expect("apigw_db");

        // Build connection string
        let url = format!(
            "postgres://{}:{}@{}:{}/{}",
            user, pass, host, port, name
        );

        // Create pool
        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(&url)
            .await?;

        Ok(Self(pool))
    }
}

