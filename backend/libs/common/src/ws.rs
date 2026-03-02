use serde::{Deserialize, Serialize};

use crate::{
    market::MarketRow,
    trading::{OrderBookSnapshot, Trade, Position, Order},
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload", rename_all = "camelCase")]
pub enum WsMessage {
    MarketSnapshot(Vec<MarketRow>),
    Book(OrderBookSnapshot),
    Trade(Vec<Trade>),
    Position(Vec<Position>),
    Order(Vec<Order>),
    OrderUpdate(Vec<OrderUpdate>),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OrderUpdate {
    pub order_id: String,
    pub symbol: String,
    pub price: f64,
    pub size: f64,
    pub status: String, // "FILLED", "PARTIAL", "CANCELLED"
}

