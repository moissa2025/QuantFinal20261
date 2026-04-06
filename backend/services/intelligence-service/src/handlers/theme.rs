use std::sync::Arc;
use axum::extract::State;
use serde::Deserialize;

use crate::{
    dto::ThemeResponse,
    services::{market_data, news, themes},
    state::AppState,
};

#[derive(Deserialize)]
pub struct ThemeRequest {
    pub slug: String,
}

pub async fn handle_theme(
    State(state): State<Arc<AppState>>,
    req: ThemeRequest,
) -> anyhow::Result<Option<ThemeResponse>> {
    let slug = req.slug;

    // 1. Theme metadata
    let theme = themes::get_theme(&state.db, &slug).await?;

    // If theme does not exist → return None
    let Some(theme) = theme else {
        return Ok(None);
    };

    // 2. Assets in this theme
    let assets = market_data::get_assets_by_theme(&state.db, &slug).await?;

    // 3. News related to this theme
    let news_items = news::get_by_theme(&state.db, &slug, 10).await?;

    // 4. Articles related to this theme
    let articles = news::get_by_theme(&state.db, &slug, 10).await?;

    Ok(Some(ThemeResponse {
        theme,
        assets,
        news: news_items,
        articles,
    }))
}

