pub async fn wallet_history(
    State(state): State<Arc<AppState>>,
    Identity { user_id, .. }: Identity,
) -> Result<Json<Value>, AppError> {
    let rows = sqlx::query!(
        r#"
        SELECT amount, balance_after, currency, created_at
        FROM wallet_transactions
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 200
        "#,
        user_id
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(json!({ "history": rows })))
}

