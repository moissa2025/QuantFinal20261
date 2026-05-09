use sqlx::Row;
use uuid::Uuid;
use chrono::Utc;

use crate::db::DbPool;

pub async fn create_session(
    db: &DbPool,
    user_id: Uuid,
    ip: Option<String>,
    device_hash: Option<String>,
) -> Result<Session, sqlx::Error> {
    let session_id = Uuid::new_v4();
    let token = Uuid::new_v4().to_string();
    let expires_at = Utc::now() + chrono::Duration::hours(1);

    sqlx::query(
        r#"
        INSERT INTO auth.sessions (id, user_id, session_token, ip, device_ua_hash, expires_at, revoked)
        VALUES ($1, $2, $3, $4, $5, $6, false)
        "#
    )
    .bind(session_id)
    .bind(user_id)
    .bind(&token)
    .bind(ip)
    .bind(device_hash)
    .bind(expires_at)
    .execute(db)
    .await?;

    Ok(Session {
        id: session_id,
        session_token: token,
        expires_at,
    })
}

pub async fn validate_session(
    db: &DbPool,
    token: &str,
    _ip: &str,
    _device_hash: &str,
) -> Result<Option<(Uuid, String, Vec<String>)>, sqlx::Error> {
    let row = sqlx::query(
        r#"
        SELECT s.user_id, s.expires_at, s.revoked, u.email
        FROM auth.sessions s
        JOIN auth.users u ON u.id = s.user_id
        WHERE s.session_token = $1
        "#
    )
    .bind(token)
    .fetch_optional(db)
    .await?;

    let Some(row) = row else {
        return Ok(None);
    };

    let user_id: Uuid = row.get("user_id");
    let expires_at: chrono::DateTime<Utc> = row.get("expires_at");
    let revoked: bool = row.get("revoked");
    let email: String = row.get("email");

    if revoked || expires_at < Utc::now() {
        return Ok(None);
    }

    let roles = sqlx::query(
        r#"
        SELECT r.name
        FROM auth.roles r
        JOIN auth.user_roles ur ON ur.role_id = r.id
        WHERE ur.user_id = $1
        "#
    )
    .bind(user_id)
    .fetch_all(db)
    .await?
    .into_iter()
    .map(|r| r.get::<String, _>("name"))
    .collect::<Vec<_>>();

    Ok(Some((user_id, email, roles)))
}

pub async fn revoke_session(db: &DbPool, token: &str) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"UPDATE auth.sessions SET revoked = true WHERE session_token = $1"#
    )
    .bind(token)
    .execute(db)
    .await?;

    Ok(())
}

pub fn normalise_device_ua(ua: &str) -> String {
    ua.trim().to_lowercase()
}

pub fn hash_device_ua(ua: &str) -> String {
    format!("{:x}", md5::compute(ua))
}

pub struct Session {
    pub id: Uuid,
    pub session_token: String,
    pub expires_at: chrono::DateTime<Utc>,
}

