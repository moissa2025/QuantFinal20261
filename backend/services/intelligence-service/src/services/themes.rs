use sqlx::PgPool;
use crate::dto::ThemeSummary;

pub async fn get_featured_themes(pool: &PgPool) -> sqlx::Result<Vec<ThemeSummary>> {
    let rows = sqlx::query!(
        r#"
        SELECT slug, name, description
        FROM intelligence.themes
        ORDER BY updated_at DESC
        LIMIT 10
        "#
    )
    .fetch_all(pool)
    .await?;

    Ok(rows.into_iter().map(|r| ThemeSummary {
        slug: r.slug,
        name: r.name,
        description: r.description.unwrap_or_default(),
    }).collect())
}

pub async fn get_theme(pool: &PgPool, slug: &str) -> sqlx::Result<Option<ThemeSummary>> {
    let row = sqlx::query!(
        r#"
        SELECT slug, name, description
        FROM intelligence.themes
        WHERE slug = $1
        "#,
        slug
    )
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|r| ThemeSummary {
        slug: r.slug,
        name: r.name,
        description: r.description.unwrap_or_default(),
    }))
}

