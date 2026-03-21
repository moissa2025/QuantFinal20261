use sqlx::{Pool, Postgres, postgres::PgPoolOptions};
use std::env;

#[derive(Clone)]
pub struct DbPool(pub Pool<Postgres>);

impl DbPool {
    pub async fn connect_from_env() -> Result<Self, sqlx::Error> {
        // CockroachDB Cloud always uses DATABASE_URL
        let url = env::var("DATABASE_URL")
            .expect("DATABASE_URL must be set for CockroachDB Cloud");

        println!("🔐 Using CockroachDB Cloud connection string");

        let pool = PgPoolOptions::new()
            .max_connections(10)
            .connect(&url)
            .await?;

        Ok(Self(pool))
    }
}

