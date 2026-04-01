state.nats.publish("wallet.balance.updated", &json!({
    "type": "wallet.balance.updated",
    "account_id": account.id,
    "balance": account.balance,
    "currency": account.currency,
    "user_id": account.user_id,
    "timestamp": chrono::Utc::now(),
})).await?;

state.nats.publish("wallet.transaction.created", &json!({
    "type": "wallet.transaction.created",
    "tx": tx,
    "timestamp": chrono::Utc::now(),
})).await?;

