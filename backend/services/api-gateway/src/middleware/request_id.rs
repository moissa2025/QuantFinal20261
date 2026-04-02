use axum::{
    http::Request,
    middleware::Next,
    response::Response,
};
use uuid::Uuid;

pub async fn request_id_middleware<B>(
    mut req: Request<B>,
    next: Next<B>,
) -> Response
where
    B: Send + 'static,
{
    req.extensions_mut().insert(Uuid::new_v4());
    next.run(req).await
}

