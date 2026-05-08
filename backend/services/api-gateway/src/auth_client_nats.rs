use crate::nats_client::{NatsClient, NatsError};
use common::auth_messages::{
    // LOGIN
    AuthLoginRequest,
    AuthLoginResponse,

    // REFRESH
    AuthRefreshRequest,
    AuthRefreshResponse,

    // LOGOUT
    AuthLogoutRequest,

    // VALIDATE SESSION
    AuthValidateSessionRequest,
    AuthValidateSessionResponse,

    // MFA VERIFY
    AuthMfaVerifyRequest,
    AuthMfaVerifyResponse,

    // MFA SETUP (TOTP)
    AuthMfaSetupRequest,
    AuthMfaSetupResponse,

    // REGISTER
    RegisterRequest,
    RegisterResponse,

    // ACTIVATE
    ActivateResponse,
};

#[derive(Clone)]
pub struct AuthNatsClient {
    nats: NatsClient,
}

impl AuthNatsClient {
    pub fn new(nats: NatsClient) -> Self {
        Self { nats }
    }

    //
    // REGISTER
    //
    pub async fn register(
        &self,
        req: RegisterRequest,
    ) -> Result<RegisterResponse, NatsError> {
        self.nats.rpc("auth.register.request", &req).await
    }

    //
    // ACTIVATE
    //
    pub async fn activate(
        &self,
        token: String,
    ) -> Result<ActivateResponse, NatsError> {
        let req = serde_json::json!({ "token": token });
        self.nats.rpc("auth.activate.request", &req).await
    }

    //
    // LOGIN
    //
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

        self.nats.rpc("auth.login.request", &req).await
    }

    //
    // REFRESH
    //
    pub async fn refresh(
        &self,
        req: AuthRefreshRequest,
    ) -> Result<AuthRefreshResponse, NatsError> {
        self.nats.rpc("auth.refresh.request", &req).await
    }

    //
    // VALIDATE SESSION  (your "session" endpoint)
    //
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

    //
    // LOGOUT
    //
    pub async fn logout(
        &self,
        session_token: String,
    ) -> Result<(), NatsError> {
        let req = AuthLogoutRequest { session_token };

        self.nats.rpc::<_, ()>("auth.logout.request", &req).await?;
        Ok(())
    }

    //
    // MFA VERIFY
    //
    pub async fn verify_mfa(
        &self,
        req: AuthMfaVerifyRequest,
    ) -> Result<AuthMfaVerifyResponse, NatsError> {
        self.nats.rpc("auth.mfa.verify.request", &req).await
    }

    //
    // MFA SETUP (TOTP)
    //
    pub async fn setup_totp(
        &self,
        req: AuthMfaSetupRequest,
    ) -> Result<AuthMfaSetupResponse, NatsError> {
        self.nats.rpc("auth.mfa.setup.request", &req).await
    }
}

