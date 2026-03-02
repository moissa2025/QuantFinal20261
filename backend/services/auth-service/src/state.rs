use async_nats::Client;

use crate::db::DbPool;

#[derive(Clone)]
pub struct AppState {
    pub nats: Client,
    pub db: DbPool,
}

impl AppState {
    pub fn new(nats: Client, db: DbPool) -> Self {

        Self {
            nats,
            db,
        }
    }
}

