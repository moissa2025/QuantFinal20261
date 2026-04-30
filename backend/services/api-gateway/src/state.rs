use std::sync::Arc;
use std::env;

use sqlx::{Pool, Postgres};
use sqlx::postgres::PgPoolOptions;

pub type DbPool = Pool<Postgres>;
use std::error::Error;

use crate::auth_client_http::AuthClient;
use crate::auth_client_nats::AuthNatsClient;
use crate::nats_client::NatsClient;
use crate::user_client::UserClient;
use crate::middleware::rate_limit_user::UserRateLimiter;

#[derive(Clone)]
pub struct BinanceConfig {
    pub api_key: String,
    pub secret_key: String,
}

#[derive(Clone)]
pub struct AppState {
    pub db: DbPool,
    pub nats: NatsClient,

    pub user_limiter: UserRateLimiter,

    pub auth_client: AuthClient,
    pub user_client: UserClient,

    pub auth_nats: AuthNatsClient,

    pub binance: BinanceConfig,
}

async fn init_db() -> Result<Pool<Postgres>, sqlx::Error> {
    println!("📌 api-gateway: Using CockroachDB environment variables");

    let user = env::var("DB_USER").expect("DB_USER missing");
    let pass = env::var("DB_PASSWORD").unwrap_or_default();
    let host = env::var("DB_HOST").expect("DB_HOST missing");
    let port = env::var("DB_PORT").unwrap_or_else(|_| "26257".into());
    let name = env::var("DB_NAME").expect("DB_NAME missing");
    let sslmode = env::var("DB_SSLMODE").unwrap_or_else(|_| "disable".into());

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

impl AppState {
    pub async fn new() -> Result<Self, Box<dyn Error>> {
        //
        // NATS
        //
        let nats_url = env::var("NATS_URL")
            .unwrap_or_else(|_| "nats://nats:4222".into());
        let nats = NatsClient::connect(nats_url).await?;

        let auth_nats = AuthNatsClient::new(nats.clone());

        //
        // AUTH SERVICE (HTTP)
        //
        let auth_url = env::var("AUTH_SERVICE_URL")
            .unwrap_or_else(|_| "http://auth-service:8080".into());
        let auth_client = AuthClient::new(auth_url);

        //
        // USER SERVICE (HTTP)
        //
        let user_url = env::var("USER_SERVICE_URL")
            .unwrap_or_else(|_| "http://user-service:8080".into());
        let user_client = UserClient::new(user_url);

        //
        // RATE LIMITER
        //
        let user_limiter = UserRateLimiter::new();

        //
        // DATABASE
        //
        let db = init_db().await?;

        //
        // BINANCE CONFIG
        //
        let binance = BinanceConfig {
            api_key: env::var("BINANCE_API_KEY").unwrap_or_default(),
            secret_key: env::var("BINANCE_SECRET_KEY").unwrap_or_default(),
        };

        Ok(Self {
            db,
            nats,
            user_limiter,
            auth_client,
            user_client,
            auth_nats,
            binance,
        })
    }
}

