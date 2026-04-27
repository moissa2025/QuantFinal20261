use common::auth_messages::{
    RegisterRequest,
    RegisterResponse,
    ActivateResponse,
    VerifyMfaRequest,
    MfaResponse,
    SetupTotpRequest,
    TotpSetupResponse,
    AuthLoginRequest,
    AuthLoginResponse,
    AuthRefreshRequest,
    AuthRefreshResponse,
    AuthLogoutRequest,
    AuthValidateSessionRequest,
    AuthValidateSessionResponse,
};

use reqwest::Client;
use serde::Deserialize;

#[derive(Clone)]
pub struct AuthClient {
    base_url: String,
    http: Client,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ValidateTokenResponse {
    pub user_id: String,
    pub email: String,
}

impl AuthClient {
    pub fn new(base_url: String) -> Self {
        Self {
            base_url,
            http: Client::new(),
        }
    }

    pub async fn validate_token(
        &self,
        token: &str,
    ) -> Result<ValidateTokenResponse, reqwest::Error> {
        let url = format!("{}/v1/auth/validate", self.base_url);
        let resp = self
            .http
            .get(url)
            .bearer_auth(token)
            .send()
            .await?
            .error_for_status()?
            .json::<ValidateTokenResponse>()
            .await?;

        Ok(resp)
    }
pub async fn register(&self, payload: RegisterRequest) -> Result<RegisterResponse, reqwest::Error> {
    self.http.post(format!("{}/v1/auth/register", self.base_url))
        .json(&payload)
        .send()
        .await?
        .error_for_status()?
        .json::<RegisterResponse>()
        .await
}

pub async fn activate(&self, token: String) -> Result<ActivateResponse, reqwest::Error> {
    self.http.post(format!("{}/v1/auth/activate", self.base_url))
        .json(&serde_json::json!({ "token": token }))
        .send()
        .await?
        .error_for_status()?
        .json::<ActivateResponse>()
        .await
}

pub async fn verify_mfa(&self, payload: VerifyMfaRequest) -> Result<MfaResponse, reqwest::Error> {
    self.http.post(format!("{}/v1/auth/mfa/verify", self.base_url))
        .json(&payload)
        .send()
        .await?
        .error_for_status()?
        .json::<MfaResponse>()
        .await
}

pub async fn setup_totp(&self, payload: SetupTotpRequest) -> Result<TotpSetupResponse, reqwest::Error> {
    self.http.post(format!("{}/v1/auth/mfa/setup", self.base_url))
        .json(&payload)
        .send()
        .await?
        .error_for_status()?
        .json::<TotpSetupResponse>()
        .await
}

}

