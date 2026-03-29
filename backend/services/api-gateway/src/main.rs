mod db;
mod state;
mod routes;
mod error;
mod user_client;
mod nats_client;
mod auth_client_http;
mod auth_client_nats;
mod identity;
mod middleware;
mod openapi;

use std::sync::Arc;

use axum::{
    routing::{get, post},
    Router,
    middleware::from_fn_with_state,
    Json,
};
use tower_http::trace::TraceLayer;
use tracing_subscriber::EnvFilter;

use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use tokio::net::TcpListener;
use axum::serve;

use crate::middleware::rate_limit_user::per_user_rate_limit;
use crate::middleware::auth::auth_middleware;
use crate::state::AppState;
use crate::routes::{
    balances, ledger, market, orders, positions, risk, trading, users, auth,
};

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_target(false)
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let state = Arc::new(
        AppState::new()
            .await
            .expect("❌ API Gateway failed to initialize AppState"),
    );

    let app = app(state);

    let addr = "0.0.0.0:8080";
    println!("🚀 API Gateway running on http://{addr}");

    let listener = TcpListener::bind(addr)
        .await
        .expect("❌ Failed to bind TCP listener");

    serve(listener, app)
        .await
        .expect("❌ Server error");
}

pub fn app(state: Arc<AppState>) -> Router {
    let openapi = openapi::ApiDoc::openapi();

    Router::new()
        .merge(
            SwaggerUi::new("/swagger-ui")
                // FIXED: removed duplicate .url("/openapi.json", ...)
                .url("/openapi.json", openapi.clone())
        )

        .nest(
            "/v1/auth",
            Router::new()
                .route("/login", post(auth::login_handler))
                .route("/logout", post(auth::logout_handler))
        )

        .nest(
            "/market-data",
            Router::new()
                .route("/snapshot", get(routes::market_proxy::proxy_snapshot))
                .route("/stream", get(routes::market_proxy::proxy_stream))
                .with_state(state.clone())
        )

        .nest(
            "/v1/orders",
            orders::router()
                .layer(from_fn_with_state(state.clone(), auth_middleware))
                .layer(from_fn_with_state(
                    state.user_limiter.clone(),
                    per_user_rate_limit,
                )),
        )
        .nest(
            "/v1/users",
            users::router()
                .layer(from_fn_with_state(state.clone(), auth_middleware)),
        )
        .nest(
            "/v1/positions",
            positions::router()
                .layer(from_fn_with_state(state.clone(), auth_middleware)),
        )
        .nest(
            "/v1/market",
            market::router()
                .layer(from_fn_with_state(state.clone(), auth_middleware)),
        )
        .nest(
            "/v1/trading",
            trading::router()
                .layer(from_fn_with_state(state.clone(), auth_middleware)),
        )
        .nest(
            "/v1/risk",
            risk::router()
                .layer(from_fn_with_state(state.clone(), auth_middleware)),
        )
        .nest(
            "/v1/ledger",
            ledger::router()
                .layer(from_fn_with_state(state.clone(), auth_middleware)),
        )
        .nest(
            "/v1/balances",
            balances::router()
                .layer(from_fn_with_state(state.clone(), auth_middleware)),
        )
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
                .on_response(|res: &axum::http::Response<_>, latency: std::time::Duration, _span: &tracing::Span| {
                    tracing::info!(
                        status = %res.status(),
                        latency_ms = %latency.as_millis(),
                        "request completed"
                    );
                }),
        )
}

