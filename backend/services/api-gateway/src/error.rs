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
}

#[derive(Serialize)]
struct ErrorBody {
    message: String,
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, msg) = match self {
            AppError::Nats => (StatusCode::BAD_GATEWAY, "upstream error"),
            AppError::Http(code) => (code, "request failed"),
        };

        let body = Json(ErrorBody {
            message: msg.to_string(),
        });

        (status, body).into_response()
    }
}

impl From<crate::nats_client::NatsError> for AppError {
    fn from(_: crate::nats_client::NatsError) -> Self {
        AppError::Nats
    }
}

