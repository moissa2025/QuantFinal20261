use std::sync::Arc;
use axum::extract::State;

use crate::{
    dto::{ArticleSummary, HomeResponse, ThemeSummary},
    services::{market_data, news, themes},
    state::AppState,
};

pub async fn handle_home(
    State(state): State<Arc<AppState>>,
) -> anyhow::Result<HomeResponse> {
    // Latest news briefs
    let briefs = news::get_latest(&state.db, 12).await?;

    // Market snapshot
    let markets = market_data::get_market_snapshot(&state.db).await?;

    // Featured themes
    let themes: Vec<ThemeSummary> = themes::get_featured_themes(&state.db).await?;

    // TODO: latest research
    let research_items: Vec<ArticleSummary> = vec![];

    Ok(HomeResponse {
        briefs,
        markets,
        themes,
        research: research_items,
    })
}

