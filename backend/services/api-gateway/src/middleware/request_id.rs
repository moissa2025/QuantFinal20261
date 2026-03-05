use axum::{
    body::Body,
    http::Request,
    middleware::Next,
    response::Response,
};
use uuid::Uuid;

pub async fn request_id_middleware(
    mut req: Request<Body>,
    next: Next,
) -> Response {
    req.extensions_mut().insert(Uuid::new_v4());
    next.run(req).await
}

