pub async fn list_subaccounts(
    State(state): State<Arc<AppState>>,
    Identity { user_id, .. }: Identity,
) -> Result<Json<Value>, AppError> {
    let rows = sqlx::query!(
        r#"
        SELECT id, name, type, balance, currency, created_at
        FROM wallet.subaccounts
        WHERE user_id = $1
        ORDER BY created_at
        "#,
        user_id
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(serde_json::json!({ "subaccounts": rows })))
}

