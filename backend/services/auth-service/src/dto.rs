use serde::{Deserialize, Serialize};

pub struct AuthValidateSessionResponse {
    pub user_id: String,
    pub session_id: String,
    pub valid: bool,
}

#[derive(Deserialize)]
pub struct ActivateRequest {
    pub token: String,
}

#[derive(Serialize)]
pub struct ActivateResponse {
    pub ok: bool,
}

#[derive(Deserialize)]
pub struct VerifyMfaRequest {
    pub method: String, // "email" or "totp"
    pub code: String,
    pub user_id: String,
}

#[derive(Serialize)]
pub struct VerifyMfaResponse {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_in: i64,
}

#[derive(Deserialize)]
pub struct SetupTotpRequest {
    pub user_id: String,
}

#[derive(Serialize)]
pub struct SetupTotpResponse {
    pub qr_code: Vec<u8>, // was String
    pub secret: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_in: i64,
}

#[derive(Debug, Deserialize)]
pub struct ValidateRequest {
    pub token: String,
}

#[derive(Debug, Serialize)]
pub struct ValidateResponse {
    pub valid: bool,
    pub user_id: Option<String>,
    pub email: Option<String>,
    pub roles: Option<Vec<String>>,
}

#[derive(Debug, Deserialize)]
pub struct LogoutRequest {
    pub token: String,
}

#[derive(Debug, Deserialize)]
pub struct RefreshRequest {
    pub refresh_token: String,
}

#[derive(Debug, Serialize)]
pub struct RefreshResponse {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_in: i64,
}

#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct RegisterResponse {
    pub user_id: String,
}

