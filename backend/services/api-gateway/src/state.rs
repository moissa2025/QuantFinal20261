
use crate::nats_client::NatsClient;
use crate::auth_client_nats::AuthNatsClient;

#[derive(Clone)]
pub struct AppState {
    pub nats: NatsClient,
    pub auth_nats: AuthNatsClient,
}

impl AppState {
    pub fn new(nats: NatsClient) -> Self {
        let auth_nats = AuthNatsClient::new(nats.clone());

        Self {
            nats,
            auth_nats,
        }
    }
}

