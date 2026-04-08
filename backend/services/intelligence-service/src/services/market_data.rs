use sqlx::PgPool;
use crate::dto::{AssetDto, MarketAsset, MarketSnapshot, QuoteDto};
use crate::nats_client::NatsClient; // FIXED: correct import

//
// ─────────────────────────────────────────────────────────────
//   NATS RPC HELPERS
// ─────────────────────────────────────────────────────────────
//
pub async fn get_asset_via_nats(nats: &NatsClient, symbol: &str) -> anyhow::Result<AssetDto> {
    let req = serde_json::json!({ "symbol": symbol });
    let resp = nats.request("market-data.get_asset", &req).await?;
    Ok(resp)
}

pub async fn get_quote_via_nats(nats: &NatsClient, symbol: &str) -> anyhow::Result<QuoteDto> {
    let req = serde_json::json!({ "symbol": symbol });
    let resp = nats.request("market-data.get_quote", &req).await?;
    Ok(resp)
}

//
// ─────────────────────────────────────────────────────────────
//   MARKET SNAPSHOT
// ─────────────────────────────────────────────────────────────
//
pub async fn get_market_snapshot(pool: &PgPool) -> sqlx::Result<MarketSnapshot> {
    let rows = sqlx::query!(
        r#"
        SELECT 
            a.symbol,
            q.price,
            q.change_pct,
            qs.score AS quant_score
        FROM intelligence.assets a
        JOIN intelligence.quotes q ON q.asset_id = a.id
        LEFT JOIN intelligence.quant_scores qs ON qs.asset_id = a.id
        ORDER BY q.change_pct DESC
        LIMIT 20
        "#
    )
    .fetch_all(pool)
    .await?;

    Ok(MarketSnapshot {
        top_movers: rows
            .into_iter()
            .map(|r| MarketAsset {
                symbol: r.symbol,
                price: r.price,
                change_pct: Some(r.change_pct.unwrap_or(0.0)), // FIXED
                quant_score: Some(r.quant_score.unwrap_or(0.0)),

  		})
            .collect(),
    })
}

//
// ─────────────────────────────────────────────────────────────
//   GET SINGLE ASSET
// ─────────────────────────────────────────────────────────────
//
pub async fn get_asset(pool: &PgPool, symbol: &str) -> sqlx::Result<Option<AssetDto>> {
    let row = sqlx::query!(
        r#"
        SELECT symbol, name, asset_class, exchange, currency
        FROM intelligence.assets
        WHERE symbol = $1
        "#,
        symbol
    )
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|r| AssetDto {
        symbol: r.symbol,
        name: r.name,
        asset_class: r.asset_class,
        exchange: r.exchange,
        currency: r.currency,
    }))
}

//
// ─────────────────────────────────────────────────────────────
//   GET LATEST QUOTE
// ─────────────────────────────────────────────────────────────
//
pub async fn get_latest_quote(pool: &PgPool, symbol: &str) -> sqlx::Result<Option<QuoteDto>> {
    let row = sqlx::query!(
        r#"
        SELECT q.price, q.change_abs, q.change_pct
        FROM intelligence.quotes q
        JOIN intelligence.assets a ON a.id = q.asset_id
        WHERE a.symbol = $1
        ORDER BY q.ts DESC
        LIMIT 1
        "#,
        symbol
    )
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|r| QuoteDto {
        price: r.price,
        change_abs: r.change_abs.unwrap_or(0.0), // FIXED
        change_pct: r.change_pct.unwrap_or(0.0), // FIXED
    }))
}

//
// ─────────────────────────────────────────────────────────────
//   GET ASSETS BY THEME
// ─────────────────────────────────────────────────────────────
//
pub async fn get_assets_by_theme(pool: &PgPool, slug: &str) -> sqlx::Result<Vec<MarketAsset>> {
let rows = sqlx::query!(
    r#"
    SELECT 
        a.symbol,
        q.price,
        q.change_pct,
        qs.score AS quant_score
    FROM intelligence.themes t
    JOIN intelligence.theme_assets ta 
        ON ta.theme_slug = t.slug
    JOIN intelligence.assets a 
        ON a.symbol = ta.asset_symbol
    JOIN intelligence.quotes q 
        ON q.asset_id = a.id
    LEFT JOIN intelligence.quant_scores qs 
        ON qs.asset_id = a.id
    WHERE t.slug = $1
    ORDER BY q.change_pct DESC
    "#,
    slug
)
.fetch_all(pool)
.await?;

    Ok(rows
        .into_iter()
        .map(|r| MarketAsset {
            symbol: r.symbol,
            price: r.price,
            change_pct: Some(r.change_pct.unwrap_or(0.0)), // FIXED
            quant_score: Some(r.quant_score.unwrap_or(0.0)), // FIXED
        })
        .collect())
}

