use serde::{Serialize, Deserialize};

//
// LOGIN
//
#[derive(Serialize, Deserialize, Debug)]
pub struct AuthLoginRequest {
    pub email: String,
    pub password: String,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct AuthLoginResponse {
    pub user_id: String,
    pub session_token: String,
    pub roles: Vec<String>,
    pub ttl_seconds: i64,
    pub refresh_token: Option<String>,   // <-- REQUIRED
}

//
// REFRESH
//
#[derive(Serialize, Deserialize)]
pub struct AuthRefreshRequest {
    pub refresh_token: String,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct AuthRefreshResponse {
    pub user_id: String,
    pub session_token: String,
    pub refresh_token: String,
    pub ttl_seconds: i64,
}

//
// LOGOUT
//
#[derive(Serialize, Deserialize)]
pub struct AuthLogoutRequest {
    pub session_token: String,
}

//
// VALIDATE SESSION
//
#[derive(Serialize, Deserialize)]
pub struct AuthValidateSessionRequest {
    pub session_token: String,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct AuthValidateSessionResponse {
    pub user_id: String,
    pub roles: Vec<String>,
    pub valid: bool,
}

