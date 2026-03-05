use sqlx::{Pool, Postgres, postgres::PgPoolOptions};

#[derive(Clone)]
pub struct DbPool(pub Pool<Postgres>);

impl DbPool {
    pub async fn connect_from_env() -> Result<Self, sqlx::Error> {
        let url = std::env::var("DATABASE_URL")
            .expect("DATABASE_URL must be set");

        let pool = PgPoolOptions::new()
            .max_connections(5)
            .connect(&url)
            .await?;

        Ok(Self(pool))
    }
}

