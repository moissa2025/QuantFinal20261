use axum::Router;

use crate::state::AppState;

pub mod auth;

pub fn router() -> Router<AppState> {
    Router::<AppState>::new()
        .merge(auth::router())
}

