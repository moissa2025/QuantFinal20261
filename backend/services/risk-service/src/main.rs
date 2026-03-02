use std::net::SocketAddr;
use axum::{Router, routing::post};
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::EnvFilter;
use tokio::net::TcpListener;

mod routes;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::from_default_env())
        .init();

    let app = Router::new()
        .route("/risk/check", post(routes::check_risk))
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        );

    let addr = SocketAddr::from(([0, 0, 0, 0], 8083));
    tracing::info!("risk-service listening on {}", addr);

    let listener = TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

