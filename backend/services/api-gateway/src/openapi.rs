use std::sync::LazyLock;

use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use common::auth_messages::*;

#[derive(OpenApi)]
#[openapi(
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

pub static OPENAPI: LazyLock<utoipa::openapi::OpenApi> =
    LazyLock::new(|| ApiDoc::openapi());

pub fn swagger() -> SwaggerUi {
    SwaggerUi::new("/swagger-ui")
        .url("/openapi.json", OPENAPI.clone())
}

