use sqlx::{PgPool, Row};
use crate::dto::{AssetDto, MarketAsset, MarketSnapshot, QuoteDto};
use crate::nats_client::NatsClient;

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
    let rows = sqlx::query(
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

    let top_movers = rows
        .into_iter()
        .map(|row| {
            let symbol: String = row.get("symbol");
            let price: f64 = row.get("price");
            let change_pct: Option<f64> = row.get("change_pct");
            let quant_score: Option<f64> = row.get("quant_score");

            MarketAsset {
                symbol,
                price,
                change_pct: Some(change_pct.unwrap_or(0.0)),
                quant_score: Some(quant_score.unwrap_or(0.0)),
            }
        })
        .collect();

    Ok(MarketSnapshot { top_movers })
}

//
// ─────────────────────────────────────────────────────────────
//   GET SINGLE ASSET
// ─────────────────────────────────────────────────────────────
//
pub async fn get_asset(pool: &PgPool, symbol: &str) -> sqlx::Result<Option<AssetDto>> {
    let row = sqlx::query(
        r#"
        SELECT symbol, name, asset_class, exchange, currency
        FROM intelligence.assets
        WHERE symbol = $1
        "#
    )
    .bind(symbol)
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|row| {
        let symbol: String = row.get("symbol");
        let name: String = row.get("name");
        let asset_class: String = row.get("asset_class");
        let exchange: Option<String> = row.get("exchange");
        let currency: String = row.get("currency");

        AssetDto {
            symbol,
            name,
            asset_class,
            exchange,
            currency,
        }
    }))
}

//
// ─────────────────────────────────────────────────────────────
//   GET LATEST QUOTE
// ─────────────────────────────────────────────────────────────
//
pub async fn get_latest_quote(pool: &PgPool, symbol: &str) -> sqlx::Result<Option<QuoteDto>> {
    let row = sqlx::query(
        r#"
        SELECT q.price, q.change_abs, q.change_pct
        FROM intelligence.quotes q
        JOIN intelligence.assets a ON a.id = q.asset_id
        WHERE a.symbol = $1
        ORDER BY q.ts DESC
        LIMIT 1
        "#
    )
    .bind(symbol)
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|row| {
        let price: f64 = row.get("price");
        let change_abs: Option<f64> = row.get("change_abs");
        let change_pct: Option<f64> = row.get("change_pct");

        QuoteDto {
            price,
            change_abs: change_abs.unwrap_or(0.0),
            change_pct: change_pct.unwrap_or(0.0),
        }
    }))
}

//
// ─────────────────────────────────────────────────────────────
//   GET ASSETS BY THEME
// ─────────────────────────────────────────────────────────────
//
pub async fn get_assets_by_theme(pool: &PgPool, slug: &str) -> sqlx::Result<Vec<MarketAsset>> {
    let rows = sqlx::query(
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
        "#
    )
    .bind(slug)
    .fetch_all(pool)
    .await?;

    let assets = rows
        .into_iter()
        .map(|row| {
            let symbol: String = row.get("symbol");
            let price: f64 = row.get("price");
            let change_pct: Option<f64> = row.get("change_pct");
            let quant_score: Option<f64> = row.get("quant_score");

            MarketAsset {
                symbol,
                price,
                change_pct: Some(change_pct.unwrap_or(0.0)),
                quant_score: Some(quant_score.unwrap_or(0.0)),
            }
        })
        .collect();

    Ok(assets)
}

