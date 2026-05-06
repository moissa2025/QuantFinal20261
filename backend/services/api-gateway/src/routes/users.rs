use std::sync::Arc;

use axum::{
    extract::State,
    routing::get,
    Json,
    Router,
};

use crate::{error::AppError, identity::Identity, state::AppState, user_client::UserResponse};

pub fn router() -> Router<Arc<AppState>> {
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
    State(state): State<Arc<AppState>>,
) -> Result<Json<UserResponse>, AppError> {
    let user = state
        .user_client
        .get_user_by_id(&identity.user_id)
        .await
        .map_err(|_| AppError::Http(axum::http::StatusCode::BAD_GATEWAY))?;

    Ok(Json(user))
}


