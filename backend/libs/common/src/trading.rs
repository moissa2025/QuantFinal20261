use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OrderBookSide {
    pub price: f64,
    pub size: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OrderBookSnapshot {
    pub bids: Vec<OrderBookSide>,
    pub asks: Vec<OrderBookSide>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Trade {
    pub price: f64,
    pub size: f64,
    pub side: String, // "BUY" | "SELL"
    pub ts: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Position {
    pub symbol: String,
    pub side: String, // "LONG" | "SHORT"
    pub size: f64,
    pub entry: f64,
    pub mark: f64,
    pub pnl: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Order {
    pub id: String,
    pub symbol: String,
    pub side: String, // "BUY" | "SELL"
    pub size: f64,
    pub price: f64,
    pub status: String, // "NEW" | "PARTIAL" | "FILLED" | "CANCELLED"
}

