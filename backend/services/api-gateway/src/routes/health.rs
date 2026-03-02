use axum::{routing::get, Router};

pub fn router() -> Router {
    Router::new().route("/", get(health))
}

#[tracing::instrument(name = "health_check")]
async fn health() -> &'static str {
    "OK"
}

