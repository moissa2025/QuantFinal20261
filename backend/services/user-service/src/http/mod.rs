use axum::{Router, routing::get, extract::Path, Json};
use uuid::Uuid;

use crate::{
    db::DbPool,
    repository::{
        user_repo::get_user,
        role_repo::{get_user_roles, get_all_roles},
        audit_repo::get_recent_audit_logs,
    },
};

pub fn routes(pool: DbPool) -> Router {
    Router::new()
        .route("/users/:id", get(get_user_handler))
        .route("/roles", get(get_roles_handler))
        .route("/audit", get(get_audit_handler))
        .route("/permissions/:id", get(get_permissions_handler))
        .with_state(pool)
}

async fn get_user_handler(
    Path(id): Path<Uuid>,
    pool: axum::extract::State<DbPool>,
) -> Json<serde_json::Value> {
    match get_user(&pool, id).await {
        Ok(user) => Json(serde_json::json!({ "ok": true, "user": user })),
        Err(e) => Json(serde_json::json!({ "ok": false, "error": e.to_string() })),
    }
}

async fn get_roles_handler(
    pool: axum::extract::State<DbPool>,
) -> Json<serde_json::Value> {
    match get_all_roles(&pool).await {
        Ok(roles) => Json(serde_json::json!({ "ok": true, "roles": roles })),
        Err(e) => Json(serde_json::json!({ "ok": false, "error": e.to_string() })),
    }
}

async fn get_audit_handler(
    pool: axum::extract::State<DbPool>,
) -> Json<serde_json::Value> {
    match get_recent_audit_logs(&pool, 50).await {
        Ok(logs) => Json(serde_json::json!({ "ok": true, "logs": logs })),
        Err(e) => Json(serde_json::json!({ "ok": false, "error": e.to_string() })),
    }
}

async fn get_permissions_handler(
    Path(id): Path<Uuid>,
    pool: axum::extract::State<DbPool>,
) -> Json<serde_json::Value> {
    match get_user_roles(&pool, id).await {
        Ok(roles) => Json(serde_json::json!({
            "ok": true,
            "permissions": roles
        })),
        Err(e) => Json(serde_json::json!({ "ok": false, "error": e.to_string() })),
    }
}

