use sqlx::{PgPool, Row};
use crate::dto::ArticleResponse;
use chrono::NaiveDateTime;

pub async fn get_article(pool: &PgPool, slug: &str) -> sqlx::Result<Option<ArticleResponse>> {
    let row = sqlx::query(
        r#"
        SELECT 
            title,
            summary,
            body_html,
            author,
            published_at,
            assets,
            themes
        FROM intelligence.articles
        WHERE slug = $1
        "#
    )
    .bind(slug)
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|row| {
        let title: String = row.get("title");
        let summary: Option<String> = row.get("summary");
        let body_html: String = row.get("body_html");
        let author: Option<String> = row.get("author");
        let published_at: Option<NaiveDateTime> = row.get("published_at");
        let assets: Option<Vec<String>> = row.get("assets");

        ArticleResponse {
            title,
            summary,
            body_html,
            author: author.unwrap_or_default(),
            published_at: published_at
                .map(|ts| ts.to_string())
                .unwrap_or_default(),
            assets: assets.unwrap_or_default(),
        }
    }))
}

