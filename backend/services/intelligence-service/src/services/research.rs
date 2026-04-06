use sqlx::PgPool;
use crate::dto::ArticleResponse;

pub async fn get_article(pool: &PgPool, slug: &str) -> sqlx::Result<Option<ArticleResponse>> {
    let row = sqlx::query!(
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
        "#,
        slug
    )
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|r| ArticleResponse {
        title: r.title,                               // NOT optional
        summary: r.summary,                           // Option<String>
        body_html: r.body_html,                       // NOT optional
        author: r.author.unwrap_or_default(),         // FIXED
        published_at: r
            .published_at
            .map(|ts| ts.to_string())
            .unwrap_or_default(),
        assets: r.assets.unwrap_or_default(),         // Option<Vec<String>>
    }))
}

