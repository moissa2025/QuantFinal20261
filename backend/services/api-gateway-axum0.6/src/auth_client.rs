use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Clone)]
pub struct AuthClient {
    base_url: String,
    http: Client,
}

#[derive(Serialize)]
pub struct ValidateTokenRequest {
    pub token: String,
}

#[derive(Deserialize)]
pub struct ValidateTokenResponse {
    pub user_id: String,
    pub email: String,
}

#[derive(Serialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct LoginResponse {
    pub token: String,
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
            .post(url)
            .json(&ValidateTokenRequest {
                token: token.to_string(),
            })
            .send()
            .await?
            .error_for_status()?
            .json::<ValidateTokenResponse>()
            .await?;

        Ok(resp)
    }

    pub async fn login(
        &self,
        email: String,
        password: String,
    ) -> Result<LoginResponse, reqwest::Error> {
        let url = format!("{}/v1/auth/login", self.base_url);
        let resp = self
            .http
            .post(url)
            .json(&LoginRequest { email, password })
            .send()
            .await?
            .error_for_status()?
            .json::<LoginResponse>()
            .await?;

        Ok(resp)
    }

    pub async fn register(
        &self,
        email: String,
        password: String,
    ) -> Result<(), reqwest::Error> {
        let url = format!("{}/v1/auth/register", self.base_url);
        self.http
            .post(url)
            .json(&LoginRequest { email, password })
            .send()
            .await?
            .error_for_status()?;
        Ok(())
    }
}

