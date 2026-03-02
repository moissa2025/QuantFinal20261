use sqlx::{query, query_as, Postgres, Transaction};
use uuid::Uuid;

use crate::db::DbPool;
use crate::models::{Account, Entry, Journal};

pub async fn ensure_account(
    tx: &mut Transaction<'_, Postgres>,
    user_id: Option<Uuid>,
    code: &str,
    currency: &str,
) -> Result<Account, sqlx::Error> {
    let existing = query_as::<_, Account>(
        r#"
        SELECT * FROM accounts
        WHERE user_id IS NOT DISTINCT FROM $1
          AND code = $2
          AND currency = $3
        "#,
    )
    .bind(user_id)
    .bind(code)
    .bind(currency)
    .fetch_optional(tx.as_mut())
    .await?;

    if let Some(acc) = existing {
        return Ok(acc);
    }

    query_as::<_, Account>(
        r#"
        INSERT INTO accounts (user_id, code, currency)
        VALUES ($1, $2, $3)
        RETURNING *
        "#,
    )
    .bind(user_id)
    .bind(code)
    .bind(currency)
    .fetch_one(tx.as_mut())
    .await
}

pub async fn create_journal(
    tx: &mut Transaction<'_, Postgres>,
    journal_type: &str,
    reference_id: Option<&str>,
    metadata: serde_json::Value,
) -> Result<Journal, sqlx::Error> {
    query_as::<_, Journal>(
        r#"
        INSERT INTO journals (journal_type, reference_id, metadata)
        VALUES ($1, $2, $3)
        RETURNING *
        "#,
    )
    .bind(journal_type)
    .bind(reference_id)
    .bind(metadata)
    .fetch_one(tx.as_mut())
    .await
}

pub async fn insert_entry(
    tx: &mut Transaction<'_, Postgres>,
    journal_id: Uuid,
    account_id: Uuid,
    direction: &str,
    amount: f64,
    currency: &str,
    metadata: serde_json::Value,
) -> Result<Entry, sqlx::Error> {
    query_as::<_, Entry>(
        r#"
        INSERT INTO entries (journal_id, account_id, direction, amount, currency, metadata)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        "#,
    )
    .bind(journal_id)
    .bind(account_id)
    .bind(direction)
    .bind(amount)
    .bind(currency)
    .bind(metadata)
    .fetch_one(tx.as_mut())
    .await
}

pub async fn record_double_entry(
    pool: &DbPool,
    journal_type: &str,
    reference_id: Option<&str>,
    metadata: serde_json::Value,
    entries: Vec<(Option<Uuid>, String, String, String, f64, serde_json::Value)>,
) -> Result<Journal, sqlx::Error> {
    let mut tx = pool.begin().await?;

    let journal = create_journal(&mut tx, journal_type, reference_id, metadata.clone()).await?;

    for (user_id, account_code, currency, direction, amount, meta) in entries {
        let account = ensure_account(&mut tx, user_id, &account_code, &currency).await?;

        insert_entry(
            &mut tx,
            journal.id,
            account.id,
            &direction,
            amount,
            &currency,
            meta,
        )
        .await?;
    }

    query(
        r#"
        INSERT INTO audit_logs (event_type, entity_type, entity_id, metadata)
        VALUES ('JOURNAL_RECORDED', 'JOURNAL', $1, $2)
        "#,
    )
    .bind(journal.id)
    .bind(metadata)
    .execute(tx.as_mut())
    .await?;

    tx.commit().await?;

    Ok(journal)
}

pub async fn get_balance(
    pool: &DbPool,
    user_id: Uuid,
    account_code: &str,
    currency: &str,
) -> Result<f64, sqlx::Error> {
    let rows = query_as::<_, (String, f64)>(
        r#"
        SELECT direction, amount
        FROM entries
        WHERE account_id = (
            SELECT id FROM accounts
            WHERE user_id = $1 AND code = $2 AND currency = $3
        )
        "#,
    )
    .bind(user_id)
    .bind(account_code)
    .bind(currency)
    .fetch_all(pool)
    .await?;

    let mut balance = 0.0;

    for (direction, amount) in rows {
        match direction.as_str() {
            "DEBIT" => balance -= amount,
            "CREDIT" => balance += amount,
            _ => {}
        }
    }

    Ok(balance)
}

