use utoipa::OpenApi as OpenApiDerive;

use crate::routes::auth;

#[derive(OpenApiDerive)]
#[openapi(
    paths(
        auth::login_handler,
        auth::logout_handler
    ),
    components(
        schemas(
            auth::LoginRequest,
            auth::LoginResponse
        )
    ),
    tags(
        (name = "auth", description = "Authentication endpoints")
    )
)]
pub struct ApiDoc;

