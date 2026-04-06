use std::sync::Arc;
use axum::extract::State;
use serde::Deserialize;

use crate::{
    dto::ArticleResponse,
    services::research,
    state::AppState,
};

#[derive(Deserialize)]
pub struct ArticleRequest {
    pub slug: String,
}

pub async fn handle_article(
    State(state): State<Arc<AppState>>,
    req: ArticleRequest,
) -> anyhow::Result<Option<ArticleResponse>> {
    let slug = req.slug;

    // SQLx call
    let article = research::get_article(&state.db, &slug).await?;

    Ok(article)
}

