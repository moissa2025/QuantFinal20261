use axum::routing::post;
use axum::Router;

use crate::state::AppState;
use crate::handlers::auth::{
    login,
    validate,
    logout,
    refresh,
    register,
};

pub fn router() -> Router<AppState> {
    Router::<AppState>::new()
        .route("/v1/auth/login", post(login))
        .route("/v1/auth/validate", post(validate))
        .route("/v1/auth/logout", post(logout))
        .route("/v1/auth/refresh", post(refresh))
        .route("/v1/auth/register", post(register))
}

