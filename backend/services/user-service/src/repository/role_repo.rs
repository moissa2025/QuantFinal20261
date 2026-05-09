use sqlx::query_as;
use uuid::Uuid;

use crate::db::DbPool;
use crate::models::{Role, UserRole};

pub async fn create_role(
    pool: &DbPool,
    name: &str,
    description: Option<String>,
) -> Result<Role, sqlx::Error> {
    query_as::<_, Role>(
        r#"
        INSERT INTO users.roles (name, description)
        VALUES ($1, $2)
        RETURNING *
        "#
    )
    .bind(name)
    .bind(description)
    .fetch_one(pool)
    .await
}

pub async fn assign_role_to_user(
    pool: &DbPool,
    user_id: Uuid,
    role_id: Uuid,
) -> Result<UserRole, sqlx::Error> {
    query_as::<_, UserRole>(
        r#"
        INSERT INTO users.user_roles (user_id, role_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, role_id) DO NOTHING
        RETURNING *
        "#
    )
    .bind(user_id)
    .bind(role_id)
    .fetch_one(pool)
    .await
}

pub async fn get_user_roles(
    pool: &DbPool,
    user_id: Uuid,
) -> Result<Vec<Role>, sqlx::Error> {
    query_as::<_, Role>(
        r#"
        SELECT r.*
        FROM users.roles r
        JOIN user_roles ur ON ur.role_id = r.id
        WHERE ur.user_id = $1
        "#
    )
    .bind(user_id)
    .fetch_all(pool)
    .await
}
pub async fn get_all_roles(pool: &DbPool) -> Result<Vec<Role>, sqlx::Error> {
    query_as::<_, Role>(
        r#"
        SELECT *
        FROM users.roles
        ORDER BY name ASC
        "#
    )
    .fetch_all(pool)
    .await
}


