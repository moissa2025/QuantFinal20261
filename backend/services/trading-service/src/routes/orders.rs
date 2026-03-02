use axum::{Json, extract::State};
use serde::Deserialize;
use uuid::Uuid;

use common::trading::Order;
use crate::state::AppState;
use crate::engine::types::{EngineOrder, Side, OrderType, TimeInForce};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewOrder {
    pub symbol: String,
    pub side: String,
    pub size: f64,
    pub price: f64,
}

pub async fn submit_order(
    State(state): State<AppState>,
    Json(payload): Json<NewOrder>,
) -> Json<Order> {
    let id = Uuid::new_v4().to_string();

    let engine_order = EngineOrder {
        id: id.clone(),
        symbol: payload.symbol.clone(),
        side: match payload.side.as_str() {
            "BUY" => Side::Buy,
            _ => Side::Sell,
        },
        order_type: OrderType::Limit,
        tif: TimeInForce::Gtc,
        price: payload.price,
        size: payload.size,
    };

    // Push into matching engine
    let _ = state.order_tx.send(engine_order).await;

    // Store REST-visible order
    let order = Order {
        id,
        symbol: payload.symbol,
        side: payload.side,
        size: payload.size,
        price: payload.price,
        status: "NEW".into(),
    };

    {
        let mut orders = state.orders.lock().await;
        orders.push(order.clone());
    }

    Json(order)
}

