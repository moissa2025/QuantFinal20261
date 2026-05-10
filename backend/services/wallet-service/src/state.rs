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

