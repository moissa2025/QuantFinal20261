use sqlx::query_as;

use uuid::Uuid;
use serde_json::Value;

use crate::db::DbPool;
use crate::models::{WalletAccount, WalletTransaction};

pub async fn create_account(
    pool: &DbPool,
    user_id: Uuid,
    currency: &str,
) -> Result<WalletAccount, sqlx::Error> {
    query_as::<_, WalletAccount>(
        r#"
        INSERT INTO wallet_accounts (user_id, currency)
        VALUES ($1, $2)
        RETURNING *
        "#
    )
    .bind(user_id)
    .bind(currency)
    .fetch_one(pool)
    .await
}

pub async fn get_balance(
    pool: &DbPool,
    account_id: Uuid,
) -> Result<WalletAccount, sqlx::Error> {
    query_as::<_, WalletAccount>(
        r#"
        SELECT *
        FROM wallet_accounts
        WHERE id = $1
        "#
    )
    .bind(account_id)
    .fetch_one(pool)
    .await
}

async fn record_transaction(
    conn: &mut sqlx::PgConnection,
    account_id: Uuid,
    amount: f64,
    tx_type: &str,
    metadata: Option<Value>,
) -> Result<WalletTransaction, sqlx::Error> {
    query_as::<_, WalletTransaction>(
        r#"
        INSERT INTO wallet_transactions (account_id, amount, tx_type, metadata)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        "#
    )
    .bind(account_id)
    .bind(amount)
    .bind(tx_type)
    .bind(metadata.unwrap_or(Value::Null))
    .fetch_one(conn)
    .await
}

pub async fn credit(
    pool: &DbPool,
    account_id: Uuid,
    amount: f64,
    metadata: Option<Value>,
) -> Result<WalletAccount, sqlx::Error> {
    let mut conn = pool.acquire().await?;

    let account = query_as::<_, WalletAccount>(
        r#"
        UPDATE wallet_accounts
        SET balance = balance + $2,
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
        "#
    )
    .bind(account_id)
    .bind(amount)
    .fetch_one(&mut *conn)
    .await?;

    let _tx = record_transaction(&mut conn, account_id, amount, "credit", metadata).await?;

    Ok(account)
}

pub async fn debit(
    pool: &DbPool,
    account_id: Uuid,
    amount: f64,
    metadata: Option<Value>,
) -> Result<WalletAccount, sqlx::Error> {
    let mut conn = pool.acquire().await?;

    // enforce non‑negative balance
    let account = query_as::<_, WalletAccount>(
        r#"
        UPDATE wallet_accounts
        SET balance = balance - $2,
            updated_at = NOW()
        WHERE id = $1
          AND balance >= $2
        RETURNING *
        "#
    )
    .bind(account_id)
    .bind(amount)
    .fetch_one(&mut *conn)
    .await?;

    let _tx = record_transaction(&mut conn, account_id, -amount, "debit", metadata).await?;

    Ok(account)
}

pub async fn transfer(
    pool: &DbPool,
    from_account: Uuid,
    to_account: Uuid,
    amount: f64,
    metadata: Option<Value>,
) -> Result<(WalletAccount, WalletAccount), sqlx::Error> {
    let mut tx = pool.begin().await?;

    // debit source
    let from = query_as::<_, WalletAccount>(
        r#"
        UPDATE wallet_accounts
        SET balance = balance - $2,
            updated_at = NOW()
        WHERE id = $1
          AND balance >= $2
        RETURNING *
        "#
    )
    .bind(from_account)
    .bind(amount)
    .fetch_one(&mut *tx)
    .await?;

    record_transaction(
        &mut *tx,
        from_account,
        -amount,
        "transfer_out",
        metadata.clone(),
    )
    .await?;

    // credit destination
    let to = query_as::<_, WalletAccount>(
        r#"
        UPDATE wallet_accounts
        SET balance = balance + $2,
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
        "#
    )
    .bind(to_account)
    .bind(amount)
    .fetch_one(&mut *tx)
    .await?;

    record_transaction(
        &mut *tx,
        to_account,
        amount,
        "transfer_in",
        metadata,
    )
    .await?;

    tx.commit().await?;

    Ok((from, to))
}

