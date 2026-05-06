use std::sync::Arc;

use axum::{
    extract::{Path, State},
    routing::get,
    Json, Router,
};
use serde::{Deserialize, Serialize};

use crate::error::AppError;
use crate::state::AppState;

//
// ---------- Public Router ----------
//
pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/home", get(home))
        .route("/markets", get(markets))
        .route("/tickers/:symbol", get(ticker))
        .route("/themes/:slug", get(theme))
        .route("/research/:slug", get(article))
}

//
// ---------- DTOs ----------
//
#[derive(Serialize, Deserialize)]
pub struct HomeResponse {
    pub briefs: Vec<GxBrief>,
    pub markets: MarketSnapshot,
    pub themes: Vec<ThemeSummary>,
    pub research: Vec<ArticleSummary>,
}

#[derive(Serialize, Deserialize)]
pub struct GxBrief {
    pub id: String,
    pub headline: String,
    pub summary: String,
    pub sentiment: String,
    pub assets: Vec<String>,
    pub themes: Vec<String>,
    pub published_at: String,
}

#[derive(Serialize, Deserialize)]
pub struct MarketSnapshot {
    pub top_movers: Vec<MarketAsset>,
}

#[derive(Serialize, Deserialize)]
pub struct MarketAsset {
    pub symbol: String,
    pub price: f64,
    pub change_pct: f64,
    pub quant_score: Option<f64>,
}

#[derive(Serialize, Deserialize)]
pub struct ThemeSummary {
    pub slug: String,
    pub name: String,
    pub description: String,
}

#[derive(Serialize, Deserialize)]
pub struct ArticleSummary {
    pub slug: String,
    pub title: String,
    pub summary: String,
    pub published_at: String,
}

#[derive(Serialize, Deserialize)]
pub struct TickerResponse {
    pub asset: AssetDto,
    pub quote: QuoteDto,
    pub quant: QuantDto,
    pub news: Vec<GxBrief>,
    pub articles: Vec<ArticleSummary>,
}

#[derive(Serialize, Deserialize)]
pub struct AssetDto {
    pub symbol: String,
    pub name: String,
    pub asset_class: String,
    pub exchange: Option<String>,
    pub currency: String,
}

#[derive(Serialize, Deserialize)]
pub struct QuoteDto {
    pub price: f64,
    pub change_abs: f64,
    pub change_pct: f64,
}

#[derive(Serialize, Deserialize)]
pub struct QuantDto {
    pub score: f64,
    pub label: String,
    pub explanation: String,
}

#[derive(Serialize, Deserialize)]
pub struct ThemeResponse {
    pub theme: ThemeSummary,
    pub assets: Vec<MarketAsset>,
    pub news: Vec<GxBrief>,
    pub articles: Vec<ArticleSummary>,
}

#[derive(Serialize, Deserialize)]
pub struct ArticleResponse {
    pub title: String,
    pub summary: Option<String>,
    pub body_html: String,
    pub author: String,
    pub published_at: String,
    pub assets: Vec<String>,
}

//
// ---------- Handlers ----------
//
pub async fn home(
    State(state): State<Arc<AppState>>,
) -> Result<Json<HomeResponse>, AppError> {
    let reply: HomeResponse = state
        .nats
        .request("intelligence.home", &())
        .await
        .map_err(AppError::from_nats)?;

    Ok(Json(reply))
}

pub async fn markets(
    State(state): State<Arc<AppState>>,
) -> Result<Json<MarketSnapshot>, AppError> {
    let reply: MarketSnapshot = state
        .nats
        .request("intelligence.markets", &())
        .await
        .map_err(AppError::from_nats)?;

    Ok(Json(reply))
}

pub async fn ticker(
    State(state): State<Arc<AppState>>,
    Path(symbol): Path<String>,
) -> Result<Json<TickerResponse>, AppError> {
    #[derive(Serialize)]
    struct TickerRequest {
        symbol: String,
    }

    let req = TickerRequest { symbol };

    let reply: TickerResponse = state
        .nats
        .request("intelligence.ticker", &req)
        .await
        .map_err(AppError::from_nats)?;

    Ok(Json(reply))
}

pub async fn theme(
    State(state): State<Arc<AppState>>,
    Path(slug): Path<String>,
) -> Result<Json<ThemeResponse>, AppError> {
    #[derive(Serialize)]
    struct ThemeRequest {
        slug: String,
    }

    let req = ThemeRequest { slug };

    let reply: ThemeResponse = state
        .nats
        .request("intelligence.theme", &req)
        .await
        .map_err(AppError::from_nats)?;

    Ok(Json(reply))
}

pub async fn article(
    State(state): State<Arc<AppState>>,
    Path(slug): Path<String>,
) -> Result<Json<ArticleResponse>, AppError> {
    #[derive(Serialize)]
    struct ArticleRequest {
        slug: String,
    }

    let req = ArticleRequest { slug };

    let reply: ArticleResponse = state
        .nats
        .request("intelligence.article", &req)
        .await
        .map_err(AppError::from_nats)?;

    Ok(Json(reply))
}

