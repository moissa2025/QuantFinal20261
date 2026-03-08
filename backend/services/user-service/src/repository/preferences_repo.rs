use sqlx::query_as;
use uuid::Uuid;

use crate::db::DbPool;
use crate::models::UserPreferences;

pub async fn update_preferences(
    pool: &DbPool,
    user_id: Uuid,
    theme: Option<String>,
    language: Option<String>,
    timezone: Option<String>,
) -> Result<UserPreferences, sqlx::Error> {
    query_as::<_, UserPreferences>(
        r#"
        INSERT INTO user_preferences (user_id, theme, language, timezone)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE SET
            theme = COALESCE($2, user_preferences.theme),
            language = COALESCE($3, user_preferences.language),
            timezone = COALESCE($4, user_preferences.timezone),
            updated_at = NOW()
        RETURNING *
        "#
    )
    .bind(user_id)
    .bind(theme)
    .bind(language)
    .bind(timezone)
    .fetch_one(pool)
    .await
}

