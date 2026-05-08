use axum::Router;
use std::sync::Arc;

use crate::state::AppState;

//
// Minimal wallet router.
// No business routes are wired yet because the wallet NATS API
// is not implemented in AppState or NatsClient.
//
// /v1/wallet/health is defined centrally in main.rs.
//
pub fn router() -> Router<Arc<AppState>> {
    Router::new()
}

