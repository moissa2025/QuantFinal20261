use sqlx::query_as;
use uuid::Uuid;

use crate::db::DbPool;
use crate::models::UserProfile;

pub async fn update_profile(
    pool: &DbPool,
    user_id: Uuid,
    first_name: Option<String>,
    last_name: Option<String>,
    avatar_url: Option<String>,
    bio: Option<String>,
) -> Result<UserProfile, sqlx::Error> {
    query_as::<_, UserProfile>(
        r#"
        INSERT INTO user_profiles (user_id, first_name, last_name, avatar_url, bio)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (user_id)
        DO UPDATE SET
            first_name = COALESCE($2, user_profiles.first_name),
            last_name = COALESCE($3, user_profiles.last_name),
            avatar_url = COALESCE($4, user_profiles.avatar_url),
            bio = COALESCE($5, user_profiles.bio),
            updated_at = NOW()
        RETURNING *
        "#
    )
    .bind(user_id)
    .bind(first_name)
    .bind(last_name)
    .bind(avatar_url)
    .bind(bio)
    .fetch_one(pool)
    .await
}

