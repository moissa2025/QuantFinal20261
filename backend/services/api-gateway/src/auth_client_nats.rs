use crate::nats_client::{NatsClient, NatsError};
use common::auth_messages::{
    AuthLoginRequest,
    AuthLoginResponse,
    AuthRefreshRequest,
    AuthRefreshResponse,
    AuthValidateSessionRequest,
    AuthValidateSessionResponse,
};

#[derive(Clone)]
pub struct AuthNatsClient {
    nats: NatsClient,
}

impl AuthNatsClient {
    pub fn new(nats: NatsClient) -> Self {
        Self { nats }
    }

    pub async fn login(
        &self,
        email: String,
        password: String,
    ) -> Result<AuthLoginResponse, NatsError> {
        let req = AuthLoginRequest {
            email,
            password,
            ip_address: Some("0.0.0.0".to_string()),
            user_agent: Some("api-gateway".to_string()),

        };
        self.nats.rpc("auth.refresh.request", &req).await
    }

    pub async fn validate_session(
        &self,
        session_token: String,
    ) -> Result<AuthValidateSessionResponse, NatsError> {
        let req = AuthValidateSessionRequest {
            session_token,
            ip_address: Some("0.0.0.0".to_string()),
            user_agent: Some("api-gateway".to_string()),

        };
        self.nats.rpc("auth.validate_session.request", &req).await
    }

    pub async fn logout(&self, _session_token: String) -> Result<(), NatsError> {
        // TODO: implement logout RPC
        Ok(())
    }
}

