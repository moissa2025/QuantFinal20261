use anyhow::Result;
use common::auth_messages::*;
use common::messaging::Messaging;
use crate::nats_client::NatsClient;

#[derive(Clone)]
pub struct AuthNatsClient {
    pub messaging: Messaging,
}

impl AuthNatsClient {
    pub fn new(nats: NatsClient) -> Self {
        Self {
            messaging: nats.messaging(),
        }
    }

    //
    // ─────────────────────────────────────────────────────────────
    //  REGISTER
    // ─────────────────────────────────────────────────────────────
    //
    pub async fn register(&self, req: RegisterRequest) -> Result<RegisterResponse> {
        self.messaging.rpc("auth.register", &req).await
    }

    //
    // ─────────────────────────────────────────────────────────────
    //  ACTIVATE
    // ─────────────────────────────────────────────────────────────
    //
    pub async fn activate(&self, req: ActivateRequest) -> Result<ActivateResponse> {
        self.messaging.rpc("auth.activate", &req).await
    }

    //
    // ─────────────────────────────────────────────────────────────
    //  LOGIN
    // ─────────────────────────────────────────────────────────────
    //
    pub async fn login(&self, req: AuthLoginRequest) -> Result<AuthLoginResponse> {
        self.messaging.rpc("auth.login", &req).await
    }

    //
    // ─────────────────────────────────────────────────────────────
    //  REFRESH
    // ─────────────────────────────────────────────────────────────
    //
    pub async fn refresh(&self, req: AuthRefreshRequest) -> Result<AuthRefreshResponse> {
        self.messaging.rpc("auth.refresh", &req).await
    }

    //
    // ─────────────────────────────────────────────────────────────
    //  VALIDATE SESSION
    // ─────────────────────────────────────────────────────────────
    //
    pub async fn validate_session(
        &self,
        req: AuthValidateSessionRequest,
    ) -> Result<AuthValidateSessionResponse> {
        self.messaging.rpc("auth.validate_session", &req).await
    }

    //
    // ─────────────────────────────────────────────────────────────
    //  LOGOUT
    // ─────────────────────────────────────────────────────────────
    //
    pub async fn logout(&self, req: AuthLogoutRequest) -> Result<()> {
        let _: serde_json::Value = self.messaging.rpc("auth.logout", &req).await?;
        Ok(())
    }

    //
    // ─────────────────────────────────────────────────────────────
    //  MFA VERIFY
    // ─────────────────────────────────────────────────────────────
    //
    pub async fn verify_mfa(
        &self,
        req: AuthMfaVerifyRequest,
    ) -> Result<AuthMfaVerifyResponse> {
        self.messaging.rpc("auth.mfa.verify", &req).await
    }

    //
    // ─────────────────────────────────────────────────────────────
    //  MFA SETUP
    // ─────────────────────────────────────────────────────────────
    //
    pub async fn setup_totp(
        &self,
        req: AuthMfaSetupRequest,
    ) -> Result<AuthMfaSetupResponse> {
        self.messaging.rpc("auth.mfa.setup", &req).await
    }
}

