use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use common::auth_messages::*;

use crate::routes::auth_routes;
use crate::routes::{
    balances, crypto, intelligence, ledger, market, orders, positions, risk, trading, users,
};

#[derive(OpenApi)]
#[openapi(
    paths(
        auth_routes::register,
        auth_routes::activate,
        auth_routes::login,
        auth_routes::refresh,
        auth_routes::validate_session,
        auth_routes::logout,
        auth_routes::verify_mfa,
        auth_routes::setup_totp,
    ),
    components(
        schemas(
            RegisterRequest,
            RegisterResponse,
            ActivateResponse,
            AuthLoginRequest,
            AuthLoginResponse,
            AuthRefreshRequest,
            AuthRefreshResponse,
            AuthValidateSessionRequest,
            AuthValidateSessionResponse,
            AuthLogoutRequest,
            AuthMfaVerifyRequest,
            AuthMfaVerifyResponse,
            AuthMfaSetupRequest,
            AuthMfaSetupResponse,
        )
    ),
    tags(
        (name = "auth", description = "Authentication & Identity API")
    )
)]
pub struct ApiDoc;

pub fn swagger() -> SwaggerUi {
    SwaggerUi::new("/docs")
        .url("/docs/openapi.json", ApiDoc::openapi())
}

