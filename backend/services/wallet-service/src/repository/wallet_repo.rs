use sqlx::{query_as, query};
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

pub async fn credit(
    pool: &DbPool,
    account_id: Uuid,
    amount: f64,
) -> Result<WalletAccount, sqlx::Error> {
    query_as::<_, WalletAccount>(
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
    .fetch_one(pool)
    .await
}

pub async fn debit(
    pool: &DbPool,
    account_id: Uuid,
    amount: f64,
) -> Result<WalletAccount, sqlx::Error> {
    query_as::<_, WalletAccount>(
        r#"
        UPDATE wallet_accounts
        SET balance = balance - $2,
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
        "#
    )
    .bind(account_id)
    .bind(amount)
    .fetch_one(pool)
    .await
}

