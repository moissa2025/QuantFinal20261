use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Clone)]
pub struct UserClient {
    base_url: String,
    http: Client,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct UserResponse {
    pub id: String,
    pub email: String,
}

impl UserClient {
    pub fn new(base_url: String) -> Self {
        Self {
            base_url,
            http: Client::new(),
        }
    }

    pub async fn get_user_by_id(
        &self,
        user_id: &str,
    ) -> Result<UserResponse, reqwest::Error> {
        let url = format!("{}/v1/users/{}", self.base_url, user_id);
        let resp = self
            .http
            .get(url)
            .send()
            .await?
            .error_for_status()?
            .json::<UserResponse>()
            .await?;

        Ok(resp)
    }
}

