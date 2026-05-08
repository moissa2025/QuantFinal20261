use axum::{async_trait, extract::FromRequestParts, http::request::Parts};

#[derive(Clone, Debug)]
pub struct Identity {
    pub user_id: String,
    pub session_token: String,
    pub roles: Vec<String>, // or Vec<String>, or Option<Vec<String>> if you prefer
}

#[async_trait]
impl<S> FromRequestParts<S> for Identity
where
    S: Send + Sync,
{
    type Rejection = axum::http::StatusCode;

    async fn from_request_parts(
        parts: &mut Parts,
        _state: &S,
    ) -> Result<Self, Self::Rejection> {
        parts
            .extensions
            .get::<Identity>()
            .cloned()
            .ok_or(axum::http::StatusCode::UNAUTHORIZED)
    }
}

