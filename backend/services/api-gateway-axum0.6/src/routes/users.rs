use std::sync::Arc;

use axum::{
    extract::Extension,
    http::StatusCode,
    routing::get,
    Json, Router,
};

use crate::{identity::Identity, state::AppState, user_client::UserResponse};

pub fn router() -> Router {
    Router::new().route("/v1/users/me", get(get_me))
}

async fn get_me(
    Extension(identity): Extension<Identity>,
    Extension(state): Extension<Arc<AppState>>,
) -> Result<Json<UserResponse>, StatusCode> {
    let user = state
        .user
        .get_user_by_id(&identity.user_id)
        .await
        .map_err(|_| StatusCode::BAD_GATEWAY)?;


    Ok(Json(user))
}

