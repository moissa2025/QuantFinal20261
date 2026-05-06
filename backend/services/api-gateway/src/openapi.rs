use utoipa::OpenApi as OpenApiDerive;

#[derive(OpenApiDerive)]
#[openapi(
    components(
        schemas(
            crate::routes::auth_routes::LoginRequest,
            crate::routes::auth_routes::LoginResponse
        )
    ),
    tags(
        (name = "auth", description = "Authentication endpoints")
    )
)]
pub struct ApiDoc;

