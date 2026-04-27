use sqlx::{PgPool, Row};
use crate::dto::ThemeSummary;

//
// ─────────────────────────────────────────────────────────────
//   GET FEATURED THEMES
// ─────────────────────────────────────────────────────────────
//
pub async fn get_featured_themes(pool: &PgPool) -> sqlx::Result<Vec<ThemeSummary>> {
    let rows = sqlx::query(
        r#"
        SELECT slug, name, description
        FROM intelligence.themes
        ORDER BY updated_at DESC
        LIMIT 10
        "#
    )
    .fetch_all(pool)
    .await?;

    let themes = rows
        .into_iter()
        .map(|row| ThemeSummary {
            slug: row.get::<String, _>("slug"),
            name: row.get::<String, _>("name"),
            description: row.get::<Option<String>, _>("description")
                .unwrap_or_default(),
        })
        .collect();

    Ok(themes)
}

//
// ─────────────────────────────────────────────────────────────
//   GET SINGLE THEME
// ─────────────────────────────────────────────────────────────
//
pub async fn get_theme(pool: &PgPool, slug: &str) -> sqlx::Result<Option<ThemeSummary>> {
    let row = sqlx::query(
        r#"
        SELECT slug, name, description
        FROM intelligence.themes
        WHERE slug = $1
        "#
    )
    .bind(slug)
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|row| ThemeSummary {
        slug: row.get::<String, _>("slug"),
        name: row.get::<String, _>("name"),
        description: row.get::<Option<String>, _>("description")
            .unwrap_or_default(),
    }))
}

