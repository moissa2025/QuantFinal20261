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
}

