use crate::nats_client::{NatsClient, NatsError};
use common::auth_messages::{
    RegisterRequest,
    RegisterResponse,
    ActivateResponse,
    AuthLoginRequest,
    AuthLoginResponse,
    AuthRefreshRequest,
    AuthRefreshResponse,
    AuthLogoutRequest,
    AuthValidateSessionRequest,
    AuthValidateSessionResponse,
    AuthMfaVerifyRequest,
    AuthMfaVerifyResponse,
    AuthMfaSetupRequest,
    AuthMfaSetupResponse,
};

#[derive(Clone)]
pub struct AuthNatsClient {
    nats: NatsClient,
}

impl AuthNatsClient {
    pub fn new(nats: NatsClient) -> Self {
        Self { nats }
    }

    pub async fn register(
        &self,
        req: RegisterRequest,
    ) -> Result<RegisterResponse, NatsError> {
        self.nats.rpc("auth.register.request", &req).await
    }

    pub async fn activate(
        &self,
        token: String,
    ) -> Result<ActivateResponse, NatsError> {
        let req = serde_json::json!({ "token": token });
        self.nats.rpc("auth.activate.request", &req).await
    }

    pub async fn login(
        &self,
        email: String,
        password: String,
        ip: String,
        ua: String,
    ) -> Result<AuthLoginResponse, NatsError> {
        let req = AuthLoginRequest {
            email,
            password,
            ip_address: Some(ip),
            user_agent: Some(ua),
        };

        self.nats.rpc("auth.login.request", &req).await
    }

    pub async fn refresh(
        &self,
        refresh_token: String,
        ip: String,
        ua: String,
    ) -> Result<AuthRefreshResponse, NatsError> {
        let req = AuthRefreshRequest {
            refresh_token,
            ip_address: Some(ip),
            user_agent: Some(ua),
        };

        self.nats.rpc("auth.refresh.request", &req).await
    }

    pub async fn validate_session(
        &self,
        session_token: String,
        ip: String,
        ua: String,
    ) -> Result<AuthValidateSessionResponse, NatsError> {
        let req = AuthValidateSessionRequest {
            session_token,
            ip_address: Some(ip),
            user_agent: Some(ua),
        };

        self.nats.rpc("auth.validate_session.request", &req).await
    }

    pub async fn logout(
        &self,
        session_token: String,
    ) -> Result<(), NatsError> {
        let req = AuthLogoutRequest { session_token };
        self.nats.rpc::<_, ()>("auth.logout.request", &req).await?;
        Ok(())
    }

    pub async fn verify_mfa(
        &self,
        req: AuthMfaVerifyRequest,
    ) -> Result<AuthMfaVerifyResponse, NatsError> {
        self.nats.rpc("auth.mfa.verify.request", &req).await
    }

    pub async fn setup_totp(
        &self,
        req: AuthMfaSetupRequest,
    ) -> Result<AuthMfaSetupResponse, NatsError> {
        self.nats.rpc("auth.mfa.setup.request", &req).await
    }
}

