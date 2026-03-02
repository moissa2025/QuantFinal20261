use ipnetwork::IpNetwork;
use sha2::{Digest, Sha256};
use sqlx::Row;
use uuid::Uuid;
use chrono::{DateTime, Utc};

use crate::db::DbPool;
use crate::models::Session;

const SESSION_TTL_SECONDS: i64 = 60 * 60; // 60 minutes

//
// DEVICE FINGERPRINTING
//

pub fn normalise_device_ua(raw: &str) -> String {
    let cleaned = raw
        .trim()
        .to_lowercase()
        .replace(|c: char| c.is_control(), "")
        .split_whitespace()
        .collect::<Vec<_>>()
        .join(" ");

    cleaned
        .trim_matches(|c: char| c == ';' || c == ',')
        .to_string()
}

pub fn hash_device_ua(normalised: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(normalised.as_bytes());
    format!("{:x}", hasher.finalize())
}

//
// IP SOFT BINDING (/24)
//

pub fn same_subnet_24(original: &str, current: &str) -> bool {
    let o: Vec<&str> = original.split('.').collect();
    let c: Vec<&str> = current.split('.').collect();
    if o.len() != 4 || c.len() != 4 {
        return false;
    }
    o[0] == c[0] && o[1] == c[1] && o[2] == c[2]
}

//
// SESSION CREATION
//

pub async fn create_session(
    pool: &DbPool,
    user_id: Uuid,
    ip: Option<String>,
    raw_user_agent: Option<String>,
) -> anyhow::Result<Session> {
    let session_token = Uuid::new_v4().to_string();
    let now = Utc::now();
    let expires_at = now + chrono::Duration::seconds(SESSION_TTL_SECONDS);

    let ip_network: Option<IpNetwork> = ip
        .as_deref()
        .and_then(|s| s.parse::<IpNetwork>().ok());

    let ua_norm = raw_user_agent
        .as_deref()
        .map(normalise_device_ua);

    let device_hash = ua_norm
        .as_deref()
        .map(hash_device_ua);

    let rec = sqlx::query_as!(
        Session,
        r#"
        INSERT INTO sessions (
            id, user_id, session_token,
            ip_address, user_agent, device_hash,
            expires_at, created_at, last_activity_at, revoked
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$8,false)
        RETURNING id, user_id, session_token,
                  ip_address, user_agent, device_hash,
                  expires_at, created_at, last_activity_at, revoked
        "#,
        Uuid::new_v4(),
        user_id,
        session_token,
        ip_network,
        raw_user_agent,
        device_hash,
        expires_at,
        now
    )
    .fetch_one(pool)
    .await?;

    Ok(rec)
}


//
// SESSION VALIDATION
//

pub async fn validate_session(
    pool: &DbPool,
    token: &str,
    ip: &str,
    device_ua_hash: &str,
) -> anyhow::Result<Option<(Uuid, String, Vec<String>)>> {
    let now: DateTime<Utc> = Utc::now();

    let row = sqlx::query(
        r#"
        SELECT s.user_id, s.ip_address, s.user_agent, s.expires_at, s.revoked, u.email
        FROM sessions s
        JOIN users u ON u.id = s.user_id
        WHERE s.session_token = $1
        "#
    )
    .bind(token)
    .fetch_optional(pool)
    .await?;

    let Some(row) = row else {
        return Ok(None);
    };

    let user_id: Uuid = row.get("user_id");
    let stored_ip: Option<String> = row.get("ip_address");
    let stored_ua_hash: Option<String> = row.get("user_agent");
    let expires_at: DateTime<Utc> = row.get("expires_at");
    let revoked: bool = row.get("revoked");
    let email: String = row.get("email");

    if revoked || expires_at <= now {
        return Ok(None);
    }

    if let Some(stored_hash) = stored_ua_hash {
        if stored_hash != device_ua_hash {
            return Ok(None);
        }
    }
    let stored_ip: Option<String> = row.try_get("ip_address")?;
    if let Some(stored_ip) = stored_ip.as_ref() {
        if !same_subnet_24(&stored_ip, ip) {
            return Ok(None);
        }
    }

    let roles_rows = sqlx::query(
        r#"
        SELECT r.name
        FROM roles r
        JOIN user_roles ur ON ur.role_id = r.id
        WHERE ur.user_id = $1
        "#
    )
    .bind(user_id)
    .fetch_all(pool)
    .await?;

    let roles = roles_rows
        .into_iter()
        .map(|r| r.get::<String, _>("name"))
        .collect();

    Ok(Some((user_id, email, roles)))
}

//
// SESSION REVOCATION
//

pub async fn revoke_session(pool: &DbPool, token: &str) -> anyhow::Result<()> {
    sqlx::query(
        r#"UPDATE sessions SET revoked = true WHERE session_token = $1"#
    )
    .bind(token)
    .execute(pool)
    .await?;
    Ok(())
}

