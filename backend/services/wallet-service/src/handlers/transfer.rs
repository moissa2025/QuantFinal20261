// Sender
state.nats.publish("wallet.balance.updated", &json!({
    "type": "wallet.balance.updated",
    "account_id": from.id,
    "balance": from.balance,
    "currency": from.currency,
    "user_id": from.user_id,
    "timestamp": chrono::Utc::now(),
})).await?;

// Receiver
state.nats.publish("wallet.balance.updated", &json!({
    "type": "wallet.balance.updated",
    "account_id": to.id,
    "balance": to.balance,
    "currency": to.currency,
    "user_id": to.user_id,
    "timestamp": chrono::Utc::now(),
})).await?;

state.nats.publish("wallet.transaction.created", &json!({
    "type": "wallet.transaction.created",
    "tx": tx,
    "timestamp": chrono::Utc::now(),
})).await?;

