use std::sync::Arc;
use crate::utils::binance::BinanceClient;
use sqlx::PgPool;
use async_nats::Client as NatsClient;

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub nats: NatsClient,
    pub binance_client: Arc<BinanceClient>,
}

impl AppState {
    pub async fn new(pool: PgPool, nats: NatsClient) -> Self {
        let api_key = std::env::var("BINANCE_API_KEY")
            .expect("BINANCE_API_KEY missing");

        let rsa_private_key = std::env::var("BINANCE_RSA_PRIVATE_KEY")
            .expect("BINANCE_RSA_PRIVATE_KEY missing");

        let binance_client = Arc::new(BinanceClient::new(api_key, rsa_private_key));

        Self {
            pool,
            nats,
            binance_client,
        }
    }
}

