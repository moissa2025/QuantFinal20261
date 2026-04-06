use sqlx::PgPool;
use crate::dto::QuantDto;
use crate::nats_client::NatsClient; // FIXED IMPORT

//
// ─────────────────────────────────────────────────────────────
//   NATS RPC
// ─────────────────────────────────────────────────────────────
//
pub async fn get_quant_via_nats(nats: &NatsClient, symbol: &str) -> anyhow::Result<QuantDto> {
    let req = serde_json::json!({ "symbol": symbol });
    let resp = nats.request("quant.get_latest", &req).await?;
    Ok(resp)
}

//
// ─────────────────────────────────────────────────────────────
//   SQLX QUERY
// ─────────────────────────────────────────────────────────────
//
pub async fn get_latest_score(pool: &PgPool, symbol: &str) -> sqlx::Result<Option<QuantDto>> {
    let row = sqlx::query!(
        r#"
        SELECT 
            qs.score,
            qs.label,
            qs.explanation
        FROM intelligence.quant_scores qs
        JOIN intelligence.assets a ON a.id = qs.asset_id
        WHERE a.symbol = $1
        ORDER BY qs.as_of DESC
        LIMIT 1
        "#,
        symbol
    )
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|r| QuantDto {
        score: r.score.unwrap_or(0.0),               // FIXED
        label: r.label.unwrap_or_default(),          // FIXED
        explanation: r.explanation.unwrap_or_default(), // FIXED
    }))
}

