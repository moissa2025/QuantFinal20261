use std::sync::Arc;
use sqlx::{Pool, Postgres};
use sqlx::postgres::PgPoolOptions;

use crate::nats_client::NatsClient;

#[derive(Clone)]
pub struct AppState {
    pub db: Pool<Postgres>,
    pub nats: NatsClient,
}

impl AppState {
    pub async fn new() -> anyhow::Result<Self> {
        //
        // ⭐ DATABASE INITIALIZATION (production + local port-forwarding)
        //
        println!("📌 intelligence-service: Using CockroachDB environment variables");

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

        println!("📌 intelligence-service: Connecting to {}", url);

        let db = PgPoolOptions::new()
            .max_connections(10)
            .connect(&url)
            .await?;

        //
        // ⭐ NATS INITIALIZATION
        //
        let nats_url = std::env::var("NATS_URL")
            .unwrap_or_else(|_| "nats://localhost:4222".into());

        println!("📡 intelligence-service: Connecting to NATS at {}", nats_url);

        let nats = NatsClient::connect(&nats_url).await?;

        println!("🚀 intelligence-service: DB + NATS initialized");

        Ok(Self { db, nats })
    }
}

pub type SharedState = Arc<AppState>;

