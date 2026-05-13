use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

//
// ─────────────────────────────────────────────────────────────
//  REGISTER
// ─────────────────────────────────────────────────────────────
//

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct RegisterResponse {
    pub user_id: String,
    pub requires_activation: bool,
}

//
// ─────────────────────────────────────────────────────────────
//  ACTIVATE ACCOUNT
// ─────────────────────────────────────────────────────────────
//

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct ActivateRequest {
    pub token: String,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct ActivateResponse {
    pub ok: bool,
}

//
// ─────────────────────────────────────────────────────────────
//  LOGIN
// ─────────────────────────────────────────────────────────────
//

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct AuthLoginRequest {
    pub email: String,
    pub password: String,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct AuthLoginResponse {
    pub user_id: String,
    pub mfa_required: bool,
    pub session_token: Option<String>,
    pub refresh_token: Option<String>,
    pub roles: Vec<String>,
    pub ttl_seconds: Option<i64>,
}

//
// ─────────────────────────────────────────────────────────────
//  MFA SETUP (TOTP)
// ─────────────────────────────────────────────────────────────
//

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct AuthMfaSetupRequest {
    pub user_id: String,
    pub code: String, // first TOTP code to confirm
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct AuthMfaSetupResponse {
    pub ok: bool,
    pub secret: Option<String>,
    pub qr_code: Option<String>,
}

//
// ─────────────────────────────────────────────────────────────
//  MFA VERIFY (NATS RPC)
// ─────────────────────────────────────────────────────────────
//

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct AuthMfaVerifyRequest {
    pub user_id: String,
    pub method: String, // "email" or "totp"
    pub code: String,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct AuthMfaVerifyResponse {
    pub ok: bool,
    pub session_token: Option<String>,
    pub refresh_token: Option<String>,
    pub roles: Vec<String>,
    pub ttl_seconds: Option<i64>,
}

//
// ─────────────────────────────────────────────────────────────
//  REFRESH TOKEN
// ─────────────────────────────────────────────────────────────
//

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct AuthRefreshRequest {
    pub refresh_token: String,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct AuthRefreshResponse {
    pub user_id: String,
    pub session_token: String,
    pub refresh_token: String,
    pub roles: Vec<String>,
    pub ttl_seconds: i64,
}

//
// ─────────────────────────────────────────────────────────────
//  LOGOUT
// ─────────────────────────────────────────────────────────────
//

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct AuthLogoutRequest {
    pub session_token: String,
}

//
// ─────────────────────────────────────────────────────────────
//  VALIDATE SESSION
// ─────────────────────────────────────────────────────────────
//

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct AuthValidateSessionRequest {
    pub session_token: String,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct AuthValidateSessionResponse {
    pub user_id: String,
    pub roles: Vec<String>,
    pub valid: bool,
}

//
// ─────────────────────────────────────────────────────────────
//  HTTP‑ONLY DTOs (Frontend → Gateway)
// ─────────────────────────────────────────────────────────────
//

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct VerifyMfaRequest {
    pub method: String,
    pub code: String,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct MfaResponse {
    pub access_token: String,
    pub refresh_token: String,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct SetupTotpRequest {
    pub code: String,
}

#[derive(Serialize, Deserialize, Debug, ToSchema)]
pub struct TotpSetupResponse {
    pub qr_code: String,
    pub secret: String,
}

