use sqlx::query_as;
use uuid::Uuid;

use crate::db::DbPool;
use crate::models::User;

pub async fn create_user(
    pool: &DbPool,
    email: &str,
    username: &str,
) -> Result<User, sqlx::Error> {
    query_as::<_, User>(
        r#"
        INSERT INTO users (email, username)
        VALUES ($1, $2)
        RETURNING *
        "#
    )
    .bind(email)
    .bind(username)
    .fetch_one(pool)
    .await
}

pub async fn get_user(
    pool: &DbPool,
    user_id: Uuid,
) -> Result<User, sqlx::Error> {
    query_as::<_, User>(
        r#"
        SELECT * FROM users
        WHERE id = $1
        "#
    )
    .bind(user_id)
    .fetch_one(pool)
    .await
}

