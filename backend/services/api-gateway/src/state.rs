use std::env;
use std::error::Error;

use crate::auth_client_http::AuthClient;
use crate::auth_client_nats::AuthNatsClient;
use crate::nats_client::NatsClient;
use crate::user_client::UserClient;
use crate::middleware::rate_limit_user::UserRateLimiter;
use crate::db::DbPool;

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
        let db = DbPool::connect_from_env().await?;

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
