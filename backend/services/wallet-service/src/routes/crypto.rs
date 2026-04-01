pub async fn crypto_deposit(
    State(state): State<Arc<AppState>>,
    Json(body): Json<Value>,
) -> Result<Json<Value>, AppError> {
    let account_id = body["account_id"].as_str().unwrap();
    let amount_usd = body["amount_usd"].as_f64().unwrap();

    sqlx::query!(
        r#"
        UPDATE wallet_accounts
        SET crypto_balance_usd = crypto_balance_usd + $1
        WHERE id = $2
        "#,
        amount_usd,
        account_id
    )
    .execute(&state.db)
    .await?;

    state.nats.publish(
        "wallet.crypto.updated",
        &json!({
            "type": "wallet.crypto.updated",
            "account_id": account_id,
            "crypto_balance_usd": amount_usd,
            "timestamp": chrono::Utc::now(),
        }),
    ).await?;

    Ok(Json(json!({ "status": "ok" })))
}

