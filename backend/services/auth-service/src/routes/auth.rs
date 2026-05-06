use axum::{
    routing::{get, post},
    Router,
};
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
    Router::new()

        // Auth core
        .route("/login", post(login))
        .route("/validate", post(validate))
        .route("/logout", post(logout))
        .route("/refresh", post(refresh))
        .route("/register", post(register))
        .route("/activate", post(activate))

        // MFA
        .route("/mfa/verify", post(verify_mfa))
        .route("/mfa/setup", post(setup_totp))
}

