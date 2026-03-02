use async_nats::Client as NatsClient;
use reqwest::Client as HttpClient;

use crate::auth_client::AuthClient;
use crate::user_client::UserClient;

pub struct AppState {
    pub nats: NatsClient,
    pub auth: AuthClient,
    pub user: UserClient,
    pub http: HttpClient,
}

impl AppState {
    pub fn new(
        nats: NatsClient,
        auth: AuthClient,
        user: UserClient,
        http: HttpClient,
    ) -> Self {
        Self { nats, auth, user, http }
    }
}

