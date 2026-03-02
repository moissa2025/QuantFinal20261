use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MarketRow {
    pub symbol: String,
    pub name: String,
    pub r#type: String, // "Crypto", "FX", "ETF", "Index", "Commodity"
    pub price: f64,
    pub change_pct: f64,
    pub volume: String,
    pub mcap: String,
}

