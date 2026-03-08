use crate::db::DbPool;
use async_nats::Client;

#[derive(Clone)]
pub struct AppState {
    pub pool: DbPool,
    pub nats: Client,
}

