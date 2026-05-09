use std::sync::Arc;

use axum::{
    routing::get,
    middleware::from_fn_with_state,
    response::IntoResponse,
    Json,
    Router,
    Extension,
};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use hyper::Server;
use tower::make::Shared;

mod state;
mod nats_client;
mod auth_client_nats;
mod openapi;
mod middleware;
mod routes;
mod db;
mod identity;
mod error;

use crate::state::AppState;
use crate::nats_client::NatsClient;
use crate::middleware::rate_limit_user::UserRateLimiter;
use crate::middleware::auth::auth_middleware;

use crate::routes::{
    auth_routes,
    users,
    wallet,
    balances,
    market,
    market_proxy,
    orders,
    positions,
    trading,
    risk,
    ledger,
    intelligence,
    crypto,
    auth_proxy,
};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // INIT STATE
    let nats = NatsClient::connect_from_env().await?;
    let state = Arc::new(AppState::new(nats));
    let rate_limiter = UserRateLimiter::new();

    // BUILD APP
    let app = app(state.clone(), rate_limiter);

    // SERVE
    let addr = "0.0.0.0:8080".parse::<std::net::SocketAddr>()?;
    println!("🚀 API Gateway running on {}", addr);

    Server::bind(&addr)
        .serve(Shared::new(app))
        .await?;

    Ok(())
}

async fn openapi_json() -> impl IntoResponse {
    Json(crate::openapi::ApiDoc::openapi())
}

pub fn app(state: Arc<AppState>, rate_limiter: UserRateLimiter) -> Router {
    Router::new()
        // GLOBAL STATE INJECTION (stateless router)
        .layer(Extension(state.clone()))
        .layer(Extension(rate_limiter))

        // SWAGGER
        .merge(
            SwaggerUi::new("/swagger-ui")
                .url("/openapi.json", crate::openapi::OPENAPI.clone()),
        )
        .route("/openapi.json", get(openapi_json))

        // PUBLIC AUTH
        .nest("/v1/auth", auth_routes::router())
        .route("/v1/auth/health", get(|| async { "OK" }))

        // PROTECTED ROUTES (middleware uses state.clone())
        .nest(
            "/v1/users",
            users::router().layer(from_fn_with_state(state.clone(), auth_middleware)),
        )
        .nest(
            "/v1/wallet",
            wallet::router().layer(from_fn_with_state(state.clone(), auth_middleware)),
        )
        .nest(
            "/v1/balances",
            balances::router().layer(from_fn_with_state(state.clone(), auth_middleware)),
        )
        .nest(
            "/v1/market",
            market::router().layer(from_fn_with_state(state.clone(), auth_middleware)),
        )
        .nest(
            "/v1/orders",
            orders::router().layer(from_fn_with_state(state.clone(), auth_middleware)),
        )
        .nest(
            "/v1/positions",
            positions::router().layer(from_fn_with_state(state.clone(), auth_middleware)),
        )
        .nest(
            "/v1/trading",
            trading::router().layer(from_fn_with_state(state.clone(), auth_middleware)),
        )
        .nest(
            "/v1/risk",
            risk::router().layer(from_fn_with_state(state.clone(), auth_middleware)),
        )
        .nest(
            "/v1/ledger",
            ledger::router().layer(from_fn_with_state(state.clone(), auth_middleware)),
        )

        // PUBLIC ROUTES
        .nest("/v1/intelligence", intelligence::router())
        .nest("/v1/crypto", crypto::router())
        .nest("/v1/market-proxy", market_proxy::router())
        .nest("/v1/auth-proxy", auth_proxy::router())
}

