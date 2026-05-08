use std::sync::Arc;

use axum::{
    routing::get,
    middleware::from_fn_with_state,
    response::IntoResponse,
    Extension,
    Json,
    Router,
};
use tower::make::Shared;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

// Module declarations
mod state;
mod nats_client;
mod auth_client_nats;
mod openapi;
mod middleware;
mod routes;
mod db;
mod identity;
mod error;

// Imports from our modules
use crate::state::AppState;
use crate::nats_client::NatsClient;
use crate::middleware::rate_limit_user::UserRateLimiter;
use crate::middleware::auth::auth_middleware;

// Route modules
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
    // Connect to NATS
    let nats = NatsClient::connect_from_env().await?;

    // Build shared state (this also wires AuthNatsClient inside AppState)
    let state = Arc::new(AppState::new(nats));

    // Rate limiter
    let rate_limiter = UserRateLimiter::new();

// Build router
let app = app(state.clone(), rate_limiter);

// IMPORTANT: erase state type so Router<()> is served
let app = app.with_state(());

// Bind address
let addr = "0.0.0.0:8080".parse::<std::net::SocketAddr>()?;
println!("🚀 API Gateway running on {}", addr);

// Serve (Axum 0.6)
axum::Server::bind(&addr)
    .serve(app.into_make_service())
    .await?;

    Ok(())
}

async fn openapi_json() -> impl IntoResponse {
    Json(crate::openapi::ApiDoc::openapi())
}

pub fn app(rate_limiter: UserRateLimiter) -> Router {    
  Router::<Arc<AppState>>::new()
        .layer(Extension(rate_limiter))

        // Swagger UI
        .merge(
            SwaggerUi::new("/swagger-ui")
                .url("/openapi.json", crate::openapi::OPENAPI.clone()),
        )
        .route("/openapi.json", get(openapi_json))

        // AUTH
        .merge(
            Router::new()
                .route("/v1/auth/health", get(|| async { "OK" }))
                .nest("/v1/auth", auth_routes::router().with_state(state.clone())),
        )

        // USERS
        .merge(
            Router::new()
                .route("/v1/users/health", get(|| async { "OK" }))
                .nest(
                    "/v1/users",
                    users::router()
                        .layer(from_fn_with_state(state.clone(), auth_middleware)),
                ),
        )

        // WALLET
        .merge(
            Router::new()
                .route("/v1/wallet/health", get(|| async { "OK" }))
                .nest(
                    "/v1/wallet",
                    wallet::router()
                        .layer(from_fn_with_state(state.clone(), auth_middleware)),
                ),
        )

        // BALANCES
        .merge(
            Router::new()
                .route("/v1/balances/health", get(|| async { "OK" }))
                .nest(
                    "/v1/balances",
                    balances::router()
                        .layer(from_fn_with_state(state.clone(), auth_middleware)),
                ),
        )

        // MARKET
        .merge(
            Router::new()
                .route("/v1/market/health", get(|| async { "OK" }))
                .nest(
                    "/v1/market",
                    market::router()
                        .layer(from_fn_with_state(state.clone(), auth_middleware)),
                ),
        )

        // MARKET PROXY
        .merge(
            Router::new()
                .nest("/v1/market-proxy", market_proxy::router()),
        )

        // ORDERS
        .merge(
            Router::new()
                .route("/v1/orders/health", get(|| async { "OK" }))
                .nest(
                    "/v1/orders",
                    orders::router()
                        .layer(from_fn_with_state(state.clone(), auth_middleware)),
                ),
        )

        // POSITIONS
        .merge(
            Router::new()
                .route("/v1/positions/health", get(|| async { "OK" }))
                .nest(
                    "/v1/positions",
                    positions::router()
                        .layer(from_fn_with_state(state.clone(), auth_middleware)),
                ),
        )

        // TRADING
        .merge(
            Router::new()
                .route("/v1/trading/health", get(|| async { "OK" }))
                .nest(
                    "/v1/trading",
                    trading::router()
                        .layer(from_fn_with_state(state.clone(), auth_middleware)),
                ),
        )

        // RISK
        .merge(
            Router::new()
                .route("/v1/risk/health", get(|| async { "OK" }))
                .nest(
                    "/v1/risk",
                    risk::router()
                        .layer(from_fn_with_state(state.clone(), auth_middleware)),
                ),
        )

        // LEDGER
        .merge(
            Router::new()
                .route("/v1/ledger/health", get(|| async { "OK" }))
                .nest(
                    "/v1/ledger",
                    ledger::router()
                        .layer(from_fn_with_state(state.clone(), auth_middleware)),
                ),
        )

        // INTELLIGENCE
        .merge(
            Router::new()
                .route("/v1/intelligence/health", get(|| async { "OK" }))
                .nest(
                    "/v1/intelligence",
                    intelligence::router()
                        .layer(from_fn_with_state(state.clone(), auth_middleware)),
                ),
        )

        // CRYPTO
        .merge(
            Router::new()
                .route("/v1/crypto/health", get(|| async { "OK" }))
                .nest(
                    "/v1/crypto",
                    crypto::router()
                        .layer(from_fn_with_state(state.clone(), auth_middleware)),
                ),
        )

        // AUTH PROXY
        .merge(
            Router::new()
                .nest("/v1/auth-proxy", auth_proxy::router()),
        )
}

