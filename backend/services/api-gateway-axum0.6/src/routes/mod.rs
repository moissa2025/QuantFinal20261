use std::sync::Arc;

use axum::{Extension, Router};

use crate::state::AppState;

pub mod auth;
pub mod balances;
pub mod health;
pub mod market;
pub mod orders;
pub mod positions;
pub mod risk;
pub mod users;

pub fn public_router() -> Router {
    Router::new()
        .merge(health::router())
        .merge(auth::router())
}

pub fn protected_router(state: Arc<AppState>) -> Router {
    let state_layer = Extension(state.clone());

    Router::new()
        .layer(state_layer.clone())
        .merge(market::router().layer(state_layer.clone()))
        .merge(orders::router().layer(state_layer.clone()))
        .merge(balances::router().layer(state_layer.clone()))
        .merge(positions::router().layer(state_layer.clone()))
        .merge(risk::router().layer(state_layer.clone()))
        .merge(users::router().layer(state_layer))
}

