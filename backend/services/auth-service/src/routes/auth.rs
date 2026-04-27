use axum::routing::post;
use axum::Router;

use crate::state::AppState;

use crate::handlers::auth::{
    login,
    validate,
    logout,
    refresh,
    register,
    activate,
    verify_mfa,
    setup_totp,
};

pub fn router() -> Router<AppState> {
    Router::<AppState>::new()
        .route("/v1/auth/login", post(login))
        .route("/v1/auth/validate", post(validate))
        .route("/v1/auth/logout", post(logout))
        .route("/v1/auth/refresh", post(refresh))
        .route("/v1/auth/register", post(register))
        .route("/v1/auth/activate", post(activate))
        .route("/v1/auth/mfa/verify", post(verify_mfa))
        .route("/v1/auth/mfa/setup", post(setup_totp))
}

