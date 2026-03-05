use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use sqlx::types::ipnetwork::IpNetwork;

//
// USERS
//
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub password_hash: String,
    pub created_at: DateTime<Utc>,
    pub disabled: bool,
}

//
// CREDENTIALS
//
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Credential {
    pub id: Uuid,
    pub user_id: Uuid,
    pub password_hash: String,
    pub password_algo: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

//
// ROLES
//
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Role {
    pub id: i32,
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserRole {
    pub user_id: Uuid,
    pub role_id: i32,
}

//
// SESSIONS
//
pub struct Session {
    pub id: Uuid,
    pub user_id: Uuid,
    pub session_token: String,
    pub ip_address: Option<IpNetwork>,
    pub user_agent: Option<String>,
    pub device_hash: Option<String>,
    pub expires_at: Option<DateTime<Utc>>,
    pub created_at: Option<DateTime<Utc>>,
    pub last_activity_at: Option<DateTime<Utc>>,
    pub revoked: bool,
}

//
// REFRESH TOKENS
//
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RefreshToken {
    pub id: Uuid,
    pub user_id: Uuid,
    pub token_hash: String,
    pub ciphertext: Vec<u8>,
    pub nonce: Vec<u8>,
    pub created_at: DateTime<Utc>,
    pub expires_at: DateTime<Utc>,
    pub revoked: bool,
    pub replaced_by: Option<Uuid>,
}

//
// AUDIT LOG
//
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditLog {
    pub id: i64,
    pub user_id: Option<Uuid>,
    pub event_type: String,
    pub event_data: serde_json::Value,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub created_at: DateTime<Utc>,
}

//
// LOGIN ATTEMPTS
//
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoginAttempt {
    pub id: i64,
    pub user_id: Option<Uuid>,
    pub email: Option<String>,
    pub success: bool,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub created_at: DateTime<Utc>,
}

//
// PASSWORD RESET TOKENS
//
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PasswordResetToken {
    pub id: Uuid,
    pub user_id: Uuid,
    pub token_hash: String,
    pub expires_at: DateTime<Utc>,
    pub used: bool,
    pub created_at: DateTime<Utc>,
}

//
// EMAIL VERIFICATION TOKENS
//
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailVerificationToken {
    pub id: Uuid,
    pub user_id: Uuid,
    pub token_hash: String,
    pub expires_at: DateTime<Utc>,
    pub used: bool,
    pub created_at: DateTime<Utc>,
}

//
// USER PROFILE
//
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserProfile {
    pub user_id: Uuid,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub phone_number: Option<String>,
    pub country: Option<String>,
    pub timezone: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

//
// USER PREFERENCES
//
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserPreferences {
    pub user_id: Uuid,
    pub marketing_opt_in: bool,
    pub dark_mode: bool,
    pub language: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

//
// SERVICE ACCOUNTS
//
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServiceAccount {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub created_at: DateTime<Utc>,
}

//
// API KEYS
//
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiKey {
    pub id: Uuid,
    pub service_account_id: Uuid,
    pub key_hash: String,
    pub expires_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub revoked: bool,
}

//
// EVENT LOG
//
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventLog {
    pub id: i64,
    pub event_type: String,
    pub payload: serde_json::Value,
    pub created_at: DateTime<Utc>,
}

