use utoipa::OpenApi as OpenApiDerive;

// Import REAL DTOs from common crate
use common::auth_messages::{
    AuthLoginRequest,
    AuthLoginResponse,
    RegisterRequest,
    RegisterResponse,
    AuthRefreshRequest,
    AuthRefreshResponse,
    AuthValidateSessionRequest,
    AuthValidateSessionResponse,
    AuthMfaVerifyRequest,
    AuthMfaVerifyResponse,
};

#[derive(OpenApiDerive)]
#[openapi(
    components(
        schemas(
            AuthLoginRequest,
            AuthLoginResponse,
            RegisterRequest,
            RegisterResponse,
            AuthRefreshRequest,
            AuthRefreshResponse,
            AuthValidateSessionRequest,
            AuthValidateSessionResponse,
            AuthMfaVerifyRequest,
            AuthMfaVerifyResponse
        )
    ),
    tags(
        (name = "auth", description = "Authentication endpoints")
    )
)]
pub struct ApiDoc;

