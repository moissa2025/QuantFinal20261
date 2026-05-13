use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;

#[derive(Debug)]
pub enum AppError {
    Nats,
    Http(StatusCode),
    Internal(String),
}

#[derive(Serialize)]
struct ErrorBody {
    message: String,
}
impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, msg): (StatusCode, String) = match self {
            AppError::Nats => (StatusCode::BAD_GATEWAY, "upstream error".to_string()),
            AppError::Http(code) => (code, "request failed".to_string()),
            AppError::Internal(msg) => (StatusCode::INTERNAL_SERVER_ERROR, msg),
        };

        let body = Json(ErrorBody { message: msg });

        (status, body).into_response()
    }
}

impl From<crate::nats_client::NatsError> for AppError {
    fn from(_: crate::nats_client::NatsError) -> Self {
        AppError::Nats
    }
}

impl AppError {
    pub fn from_nats(err: impl std::error::Error) -> Self {
        AppError::Internal(err.to_string())
    }
}
impl From<anyhow::Error> for AppError {
    fn from(err: anyhow::Error) -> Self {
        AppError::Internal(err.to_string())
    }
}
