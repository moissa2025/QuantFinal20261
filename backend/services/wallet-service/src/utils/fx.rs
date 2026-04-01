use sqlx::PgPool;
use crate::error::AppError;

pub async fn convert(
    db: &PgPool,
    amount: f64,
    from: &str,
    to: &str,
) -> Result<f64, AppError> {
    if from == to {
        return Ok(amount);
    }

    let row = sqlx::query!(
        r#"
        SELECT rate
        FROM wallet.fx_rates
        WHERE base_currency = $1 AND quote_currency = $2
        "#,
        from,
        to
    )
    .fetch_one(db)
    .await?;

    Ok(amount * row.rate)
}

