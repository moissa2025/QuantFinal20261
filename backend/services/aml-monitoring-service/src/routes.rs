use axum::{Json, extract::{State, Path}};
use serde_json::json;
use sqlx::PgPool;
use uuid::Uuid;

pub async fn health() -> &'static str {
    "OK"
}

