use std::sync::Arc;
use axum::extract::State;
use serde::Deserialize;

#[derive(Deserialize)]
pub struct TickerRequest {
    pub symbol: String,
}


use crate::{
    dto::TickerResponse,
    services::{
        market_data::{get_asset_via_nats, get_quote_via_nats},
        quant::get_quant_via_nats,
        news::{get_news_by_asset, get_by_asset},
    },
    state::AppState,
};
    pub async fn handle_ticker(
    State(state): State<Arc<AppState>>,
    symbol: String,
) -> anyhow::Result<TickerResponse>{
    // NATS RPC calls
    let asset = get_asset_via_nats(&state.nats, &symbol).await?;
    let quote = get_quote_via_nats(&state.nats, &symbol).await?;
    let quant = get_quant_via_nats(&state.nats, &symbol).await?;

    // SQLx calls
    let news = get_news_by_asset(&state.db, &symbol, 10).await?;
    let articles = get_by_asset(&state.db, &symbol, 10).await?;

    Ok(TickerResponse {
        asset,
        quote,
        quant,
        news,
        articles,
    })
}

