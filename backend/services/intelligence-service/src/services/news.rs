use sqlx::PgPool;
use crate::dto::GxBrief;

fn map_brief(
    id: uuid::Uuid,
    title: Option<String>,
    summary_ai: Option<String>,
    sentiment: Option<String>,
    tags_assets: Option<Vec<String>>,
    tags_themes: Option<Vec<String>>,
    published_at: Option<chrono::NaiveDateTime>,
) -> GxBrief {
    GxBrief {
        id: id.to_string(),
        headline: title.unwrap_or_default(),
        summary: summary_ai.unwrap_or_default(),
        sentiment: sentiment.unwrap_or_default(),
        assets: tags_assets.unwrap_or_default(),
        themes: tags_themes.unwrap_or_default(),
        published_at: published_at.map(|ts| ts.to_string()).unwrap_or_default(),
    }
}

pub async fn get_latest(pool: &PgPool, limit: usize) -> sqlx::Result<Vec<GxBrief>> {
    let rows = sqlx::query!(
        r#"
        SELECT id, title, summary_ai, sentiment, tags_assets, tags_themes, published_at
        FROM intelligence.news_items
        ORDER BY published_at DESC
        LIMIT $1::INT8
        "#,
        limit as i64
    )
    .fetch_all(pool)
    .await?;

    Ok(rows.into_iter().map(|r| map_brief(
        r.id, r.title, r.summary_ai, r.sentiment, r.tags_assets, r.tags_themes, r.published_at
    )).collect())
}

pub async fn get_news_by_asset(pool: &PgPool, symbol: &str, limit: usize) -> sqlx::Result<Vec<GxBrief>> {
    let rows = sqlx::query!(
        r#"
        SELECT id, title, summary_ai, sentiment, tags_assets, tags_themes, published_at
        FROM intelligence.news_items
        WHERE $1::TEXT = ANY(tags_assets)
        ORDER BY published_at DESC
        LIMIT $2::INT8
        "#,
        symbol,
        limit as i64
    )
    .fetch_all(pool)
    .await?;

    Ok(rows.into_iter().map(|r| map_brief(
        r.id, r.title, r.summary_ai, r.sentiment, r.tags_assets, r.tags_themes, r.published_at
    )).collect())
}

pub async fn get_by_asset(pool: &PgPool, symbol: &str, limit: usize) -> sqlx::Result<Vec<GxBrief>> {
    get_news_by_asset(pool, symbol, limit).await
}

pub async fn get_by_theme(pool: &PgPool, slug: &str, limit: usize) -> sqlx::Result<Vec<GxBrief>> {
    let rows = sqlx::query!(
        r#"
        SELECT id, title, summary_ai, sentiment, tags_assets, tags_themes, published_at
        FROM intelligence.news_items
        WHERE $1::TEXT = ANY(tags_themes)
        ORDER BY published_at DESC
        LIMIT $2::INT8
        "#,
        slug,
        limit as i64
    )
    .fetch_all(pool)
    .await?;

    Ok(rows.into_iter().map(|r| map_brief(
        r.id, r.title, r.summary_ai, r.sentiment, r.tags_assets, r.tags_themes, r.published_at
    )).collect())
}

