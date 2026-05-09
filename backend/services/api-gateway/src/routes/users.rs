use std::sync::Arc;

use axum::{
    extract::Extension,
    routing::get,
    Json,
    Router,
};

use crate::{error::AppError, identity::Identity, state::AppState};
use common::auth_messages::AuthValidateSessionResponse;

pub fn router() -> Router {
    Router::new()
        .route("/me", get(get_me))
}

#[tracing::instrument(
    name = "get_me",
    skip(state, identity),
    fields(user_id = %identity.user_id)
)]
pub async fn get_me(
    identity: Identity,
    Extension(state): Extension<Arc<AppState>>,
) -> Result<Json<AuthValidateSessionResponse>, AppError> {
    let user = state
        .auth_nats
        .validate_session(
            identity.session_token.clone(),
            "0.0.0.0".into(),
            "api-gateway".into(),
        )
        .await
        .map_err(|_| AppError::Http(axum::http::StatusCode::BAD_GATEWAY))?;

    Ok(Json(user))
}

