use sqlx::{query_as, query};
use uuid::Uuid;

use crate::db::DbPool;
use crate::models::User;

// CREATE USER
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

// GET USER
pub async fn get_user(
    pool: &DbPool,
    user_id: Uuid,
) -> Result<User, sqlx::Error> {
    query_as::<_, User>(
        r#"
        SELECT *
        FROM users
        WHERE id = $1
        "#
    )
    .bind(user_id)
    .fetch_one(pool)
    .await
}

// UPDATE USER
pub async fn update_user(
    pool: &DbPool,
    user_id: Uuid,
    email: Option<String>,
    username: Option<String>,
) -> Result<User, sqlx::Error> {
    query_as::<_, User>(
        r#"
        UPDATE users
        SET
            email = COALESCE($2, email),
            username = COALESCE($3, username),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
        "#
    )
    .bind(user_id)
    .bind(email)
    .bind(username)
    .fetch_one(pool)
    .await
}

