use std::sync::Arc;

use axum::{
    extract::Extension,
    routing::get,
    Router,
};

use crate::{identity::Identity, state::AppState};

pub fn router() -> Router {
    Router::new().route("/v1/orders/whoami", get(whoami))
}

async fn whoami(
    Extension(_state): Extension<Arc<AppState>>,
    identity: Option<Extension<Identity>>,
) -> String {
    match identity {
        Some(Extension(id)) => format!("user-id={}, email={}", id.user_id, id.email),
        None => "unauthenticated".to_string(),
    }
}

