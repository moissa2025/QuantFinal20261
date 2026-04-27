use sqlx::{PgPool, Row};
use crate::dto::GxBrief;
use uuid::Uuid;
use chrono::NaiveDateTime;

fn map_brief(row: sqlx::postgres::PgRow) -> GxBrief {
    let id: Uuid = row.get("id");
    let title: Option<String> = row.get("title");
    let summary_ai: Option<String> = row.get("summary_ai");
    let sentiment: Option<String> = row.get("sentiment");
    let tags_assets: Option<Vec<String>> = row.get("tags_assets");
    let tags_themes: Option<Vec<String>> = row.get("tags_themes");
    let published_at: Option<NaiveDateTime> = row.get("published_at");

    GxBrief {
        id: id.to_string(),
        headline: title.unwrap_or_default(),
        summary: summary_ai.unwrap_or_default(),
        sentiment: sentiment.unwrap_or_default(),
        assets: tags_assets.unwrap_or_default(),
        themes: tags_themes.unwrap_or_default(),
        published_at: published_at
            .map(|ts| ts.to_string())
            .unwrap_or_default(),
    }
}

pub async fn get_latest(pool: &PgPool, limit: usize) -> sqlx::Result<Vec<GxBrief>> {
    let rows = sqlx::query(
        r#"
        SELECT id, title, summary_ai, sentiment, tags_assets, tags_themes, published_at
        FROM intelligence.news_items
        ORDER BY published_at DESC
        LIMIT $1::INT8
        "#
    )
    .bind(limit as i64)
    .fetch_all(pool)
    .await?;

    Ok(rows.into_iter().map(map_brief).collect())
}

pub async fn get_news_by_asset(pool: &PgPool, symbol: &str, limit: usize) -> sqlx::Result<Vec<GxBrief>> {
    let rows = sqlx::query(
        r#"
        SELECT id, title, summary_ai, sentiment, tags_assets, tags_themes, published_at
        FROM intelligence.news_items
        WHERE $1::TEXT = ANY(tags_assets)
        ORDER BY published_at DESC
        LIMIT $2::INT8
        "#
    )
    .bind(symbol)
    .bind(limit as i64)
    .fetch_all(pool)
    .await?;

    Ok(rows.into_iter().map(map_brief).collect())
}

pub async fn get_by_asset(pool: &PgPool, symbol: &str, limit: usize) -> sqlx::Result<Vec<GxBrief>> {
    get_news_by_asset(pool, symbol, limit).await
}

pub async fn get_by_theme(pool: &PgPool, slug: &str, limit: usize) -> sqlx::Result<Vec<GxBrief>> {
    let rows = sqlx::query(
        r#"
        SELECT id, title, summary_ai, sentiment, tags_assets, tags_themes, published_at
        FROM intelligence.news_items
        WHERE $1::TEXT = ANY(tags_themes)
        ORDER BY published_at DESC
        LIMIT $2::INT8
        "#
    )
    .bind(slug)
    .bind(limit as i64)
    .fetch_all(pool)
    .await?;

    Ok(rows.into_iter().map(map_brief).collect())
}

