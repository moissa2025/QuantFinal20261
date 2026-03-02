use std::collections::HashMap;
use std::sync::Arc;

use async_nats::Client;
use tokio::sync::RwLock;

use crate::models::User;

pub struct AppState {
    pub nats: Client,
    pub users: Arc<RwLock<HashMap<String, User>>>,
}

impl AppState {
    pub fn new(nats: Client) -> Self {
        Self {
            nats,
            users: Arc::new(RwLock::new(HashMap::new())),
        }
    }
}

