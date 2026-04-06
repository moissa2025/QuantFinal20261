use serde::{Deserialize, Serialize};

//
// ─────────────────────────────────────────────────────────────
//   NEWS BRIEFS
// ─────────────────────────────────────────────────────────────
//
#[derive(Serialize, Deserialize, Clone)]
pub struct GxBrief {
    pub id: String,
    pub headline: String,
    pub summary: String,
    pub sentiment: String,
    pub assets: Vec<String>,
    pub themes: Vec<String>,
    pub published_at: String,
}

//
// ─────────────────────────────────────────────────────────────
//   MARKET DATA
// ─────────────────────────────────────────────────────────────
//
#[derive(Serialize, Deserialize, Clone)]
pub struct MarketAsset {
    pub symbol: String,
    pub price: f64,
    pub change_pct: Option<f64>,     // FIXED: now Option<f64>
    pub quant_score: Option<f64>,    // FIXED: Option<f64>
}

#[derive(Serialize, Deserialize, Clone)]
pub struct MarketSnapshot {
    pub top_movers: Vec<MarketAsset>,
}

//
// ─────────────────────────────────────────────────────────────
//   THEMES
// ─────────────────────────────────────────────────────────────
//
#[derive(Serialize, Deserialize, Clone)]
pub struct ThemeSummary {
    pub slug: String,
    pub name: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ThemeResponse {
    pub theme: ThemeSummary,
    pub assets: Vec<MarketAsset>,
    pub news: Vec<GxBrief>,
    pub articles: Vec<GxBrief>,      // FIXED: now GxBrief
}

//
// ─────────────────────────────────────────────────────────────
//   ARTICLES
// ─────────────────────────────────────────────────────────────
//
#[derive(Serialize, Deserialize, Clone)]
pub struct ArticleSummary {
    pub slug: String,
    pub title: String,
    pub summary: String,
    pub published_at: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ArticleResponse {
    pub title: String,
    pub summary: Option<String>,     // FIXED: matches CockroachDB Option<String>
    pub body_html: String,
    pub author: String,
    pub published_at: String,
    pub assets: Vec<String>,
}

//
// ─────────────────────────────────────────────────────────────
//   ASSETS / QUOTES / QUANT
// ─────────────────────────────────────────────────────────────
//
#[derive(Serialize, Deserialize, Clone)]
pub struct AssetDto {
    pub symbol: String,
    pub name: String,
    pub asset_class: String,
    pub exchange: Option<String>,
    pub currency: String,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct QuoteDto {
    pub price: f64,
    pub change_abs: f64,
    pub change_pct: f64,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct QuantDto {
    pub score: f64,
    pub label: String,
    pub explanation: String,
}

//
// ─────────────────────────────────────────────────────────────
//   HOME PAGE RESPONSE
// ─────────────────────────────────────────────────────────────
//
#[derive(Serialize, Deserialize, Clone)]
pub struct HomeResponse {
    pub briefs: Vec<GxBrief>,
    pub markets: MarketSnapshot,
    pub themes: Vec<ThemeSummary>,
    pub research: Vec<ArticleSummary>,
}

//
// ─────────────────────────────────────────────────────────────
//   TICKER RESPONSE
// ─────────────────────────────────────────────────────────────
//
#[derive(Serialize, Deserialize, Clone)]
pub struct TickerResponse {
    pub asset: AssetDto,
    pub quote: QuoteDto,
    pub quant: QuantDto,
    pub news: Vec<GxBrief>,          // FIXED: now GxBrief
    pub articles: Vec<GxBrief>,      // FIXED: now GxBrief
}

