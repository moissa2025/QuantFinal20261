use std::sync::Arc;
use axum::{extract::State, Json};
use serde_json::Value;
use crate::{state::AppState, error::AppError, identity::Identity};

pub async fn crypto_history(
    State(state): State<Arc<AppState>>,
    Identity { user_id, .. }: Identity,
) -> Result<Json<Value>, AppError> {
    let rows = sqlx::query!(
        r#"
        SELECT tx_type, asset, amount, amount_usd, created_at
        FROM wallet_crypto_transactions
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 200
        "#,
        user_id
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(serde_json::json!({ "history": rows })))
}

