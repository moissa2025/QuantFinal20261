use crate::middleware::rate_limit_user::{UserRateLimiter, per_user_rate_limit};

use once_cell::sync::Lazy;

static OPENAPI: Lazy<utoipa::openapi::OpenApi> =
    Lazy::new(|| openapi::ApiDoc::openapi());

mod db;
mod state;
mod routes;
mod error;
mod nats_client;
mod auth_client_nats;
mod identity;
mod middleware;
mod openapi;

use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use std::sync::Arc;

use axum::{
    middleware::from_fn_with_state,
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

use crate::middleware::auth::auth_middleware;
use crate::state::AppState;
use crate::nats_client::NatsClient;

use crate::routes::{
    auth_routes,
    balances,
    crypto,
    intelligence,
    ledger,
    market,
    market_proxy,
    orders,
    positions,
    risk,
    trading,
    users,
    wallet,
};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_target(false)
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    // Initialize NATS client
    let nats = NatsClient::new_blocking().expect("❌ Failed to initialize NATS client");

    // AppState::new() is NOT async and requires NatsClient
    let state = Arc::new(AppState::new(nats));
    let rate_limiter = UserRateLimiter::new();
    let app = app(state.clone(), rate_limiter.clone());

    let addr = "0.0.0.0:8080";
    println!("🚀 API Gateway running on http://{addr}");

    axum::Server::bind(&addr.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .expect("❌ Server error");
}

async fn openapi_json() -> impl IntoResponse {
    Json(openapi::ApiDoc::openapi())
}

pub fn app(state: Arc<AppState>, rate_limiter: UserRateLimiter) -> Router {
    Router::new()
        .layer(axum::Extension(rate_limiter))

        // OpenAPI / Swagger
        .merge(
            SwaggerUi::new("/swagger-ui")
                .url("/openapi.json", OPENAPI.clone()),
        )
        .route("/openapi.json", get(openapi_json))

        // AUTH (NATS)
        .merge(
            Router::new()
                .route("/v1/auth/health", get(|| async { "OK" }))
                .nest(
                    "/v1/auth",
                    auth_routes::router().with_state(state.clone()),
                ),
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

        // ORDERS (rate limiter removed)
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

        // CRYPTO
        .nest("/api", crypto::router())

        // MARKET DATA PROXY
        .nest(
            "/market-data",
            Router::new()
                .route("/snapshot", get(market_proxy::proxy_snapshot))
                .route("/stream", get(market_proxy::proxy_stream))
                .with_state(state.clone()),
        )

        // INTELLIGENCE (no auth)
        .merge(
            Router::new()
                .route("/v1/intelligence/health", get(|| async { "OK" }))
                .nest(
                    "/v1/intelligence",
                    intelligence::router().with_state(state.clone()),
                ),
        )

        // GLOBAL HEALTH
        .route("/v1/health", get(|| async { "OK" }))
        .route("/health", get(|| async { "OK" }))
        .route("/", get(|| async { "GlobalQuantX API Gateway" }))

        .with_state(state)

        .layer(
            TraceLayer::new_for_http()
                .make_span_with(|req: &axum::http::Request<_>| {
                    tracing::info_span!(
                        "http_request",
                        method = %req.method(),
                        uri = %req.uri(),
                        request_id = tracing::field::Empty,
                        user_id = tracing::field::Empty
                    )
                })
                .on_request(|req: &axum::http::Request<_>, _span: &tracing::Span| {
                    if let Some(id) = req.extensions().get::<crate::identity::Identity>() {
                        tracing::info!(user_id = %id.user_id, "request started");
                    }
                })
                .on_response(
                    |res: &axum::http::Response<_>,
                     latency: std::time::Duration,
                     _span: &tracing::Span| {
                        tracing::info!(
                            status = %res.status(),
                            latency_ms = %latency.as_millis(),
                            "request completed"
                        );
                    },
                ),
        )
}

