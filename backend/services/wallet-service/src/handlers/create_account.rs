use crate::utils::crypto::{generate_btc_address, generate_eth_address};

let btc = generate_btc_address();
let eth = generate_eth_address();

sqlx::query!(
    r#"
    INSERT INTO wallet_accounts (id, user_id, balance, currency, btc_address, eth_address)
    VALUES ($1, $2, 0, $3, $4, $5)
    "#,
    id,
    user_id,
    currency,
    btc,
    eth
)
.execute(&state.db)
.await?;

let mut payload = body.clone();
payload["user_id"] = json!(user_id);
payload["currency"] = json!(body["currency"].as_str().unwrap_or("USD"));  // ← ADD HERE

let resp = state.nats.rpc("wallet.account.create", &payload).await?;

