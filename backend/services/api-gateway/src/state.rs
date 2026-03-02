use std::error::Error;

use crate::auth_client_http::AuthClient;
use crate::auth_client_nats::AuthNatsClient;
use crate::nats_client::NatsClient;
use crate::user_client::UserClient;
use crate::middleware::rate_limit_user::UserRateLimiter;
use crate::db::DbPool;

#[derive(Clone)]
pub struct AppState {
    pub user_limiter: UserRateLimiter,

    // HTTP clients
    pub auth_client: AuthClient,
    pub user_client: UserClient,

    // NATS clients
    pub nats: NatsClient,
    pub auth_nats: AuthNatsClient,

    pub db: DbPool,
}

impl AppState {
    pub async fn new() -> Result<Self, Box<dyn Error>> {
        // 1. Connect to NATS
        let nats = NatsClient::connect("nats://127.0.0.1:4222".into()).await?;

        // 2. Typed NATS auth client
        let auth_nats = AuthNatsClient::new(nats.clone());

        // 3. HTTP clients
        let auth_client = AuthClient::new("http://localhost:9001".into());
        let user_client = UserClient::new("http://localhost:9000".into());

        // 4. Rate limiter
        let user_limiter = UserRateLimiter::new();

        // 5. DB pool
        let db = DbPool::connect_from_env().await?;

        Ok(Self {
            user_limiter,
            auth_client,
            user_client,
            nats,
            auth_nats,
            db,
        })
    }
}

