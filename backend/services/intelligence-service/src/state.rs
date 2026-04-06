use std::sync::Arc;
use sqlx::PgPool;

use crate::nats_client::NatsClient;

#[derive(Clone)]
pub struct AppState {
    pub db: PgPool,
    pub nats: NatsClient,
}

impl AppState {
    pub async fn new() -> anyhow::Result<Self> {
        // CockroachDB connection
        let db_url = std::env::var("DATABASE_URL")
            .expect("DATABASE_URL must be set");
        let db = PgPool::connect(&db_url).await?;

        // NATS connection
        let nats_url = std::env::var("NATS_URL")
            .unwrap_or_else(|_| "nats://localhost:4222".into());
        let nats = NatsClient::connect(&nats_url).await?;

        Ok(Self { db, nats })
    }
}

pub type SharedState = Arc<AppState>;

