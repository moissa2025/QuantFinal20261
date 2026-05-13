use std::sync::Arc;
use axum::{
    routing::get,
    Json, Router, Extension,
};
use serde::{Deserialize, Serialize};
use crate::{error::AppError, identity::Identity, state::AppState};

pub fn router() -> Router {
    Router::new()
        .route("/me", get(get_me))
}

#[derive(Serialize, Deserialize)]
pub struct UserProfile {
    pub user_id: String,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
}

#[tracing::instrument(
    name = "get_me",
    skip(state, identity),
    fields(user_id = %identity.user_id)
)]
pub async fn get_me(
    Extension(state): Extension<Arc<AppState>>,
    identity: Identity,
) -> Result<Json<UserProfile>, AppError> {
    let res: UserProfile = state
        .nats
        .rpc("users.me.get", &identity.user_id)
        .await?;

    Ok(Json(res))
}

