mod auth_client;
mod auth_middleware;
mod identity;
mod routes;
mod state;
mod user_client;

use std::{net::SocketAddr, sync::Arc};

use axum::{middleware, Extension, Router};
use tower_http::cors::CorsLayer;
use tracing_subscriber::EnvFilter;

use crate::{
    auth_client::AuthClient,
    auth_middleware::require_auth,
    state::AppState,
    user_client::UserClient,
};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    // NATS
    let nats = async_nats::connect("nats://127.0.0.1:4222").await?;

    // Service URLs
    let auth_url = std::env::var("AUTH_SERVICE_URL")
        .unwrap_or_else(|_| "http://127.0.0.1:3002".to_string());

    let user_url = std::env::var("USER_SERVICE_URL")
        .unwrap_or_else(|_| "http://127.0.0.1:3001".to_string());

    // Clients
    let auth_client = AuthClient::new(auth_url);
    let user_client = UserClient::new(user_url);
    let http_client = reqwest::Client::new();

    // Shared state
    let state = Arc::new(AppState::new(
        nats,
        auth_client,
        user_client,
        http_client,
    ));

    // Routers
    let public_routes = routes::public_router();
    let protected_routes = routes::protected_router(state.clone())
        .route_layer(middleware::from_fn(require_auth));

    // App
    let app = Router::new()
        .merge(public_routes)
        .merge(protected_routes)
        .layer(Extension(state))
        .layer(CorsLayer::very_permissive());

    // Serve
    let addr: SocketAddr = "0.0.0.0:3000".parse().unwrap();
    tracing::info!("api-gateway running on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await?;

    Ok(())
}

