use std::collections::HashMap;
use std::sync::Arc;

use tokio::sync::{mpsc, Mutex};

use super::orderbook::OrderBook;
use super::types::{
    EngineOrder, EngineEvent, OrderType, Side,
};
use super::positions::PositionEngine;
use super::pnl::refresh_pnl;

use common::trading::OrderBookSnapshot;

#[derive(Clone)]
pub struct MatchingEngine {
    inner: Arc<Mutex<MatchingEngineInner>>,
}

struct MatchingEngineInner {
    books: HashMap<String, OrderBook>,
    positions: PositionEngine,
}

impl MatchingEngine {
    pub fn new() -> Self {
        Self {
            inner: Arc::new(Mutex::new(MatchingEngineInner {
                books: HashMap::new(),
                positions: PositionEngine::new(),
            })),
        }
    }

    pub async fn submit_order(
        &self,
        order: EngineOrder,
    ) -> Vec<EngineEvent> {
        let mut inner = self.inner.lock().await;

        let book = inner
            .books
            .entry(order.symbol.clone())
            .or_insert_with(|| OrderBook::new(order.symbol.clone()));

        let events = match order.order_type {
            OrderType::Limit => book.add_limit_order(order.clone()),
            OrderType::Market => {
                let mut o = order.clone();
                match o.side {
                    Side::Buy => o.price = f64::MAX,
                    Side::Sell => o.price = 0.0,
                }
                book.add_limit_order(o)
            }
        };

        for ev in &events {
            if let EngineEvent::Match(m) = ev {
                let side = order.side;
                inner.positions.apply_match(m, side);
            }
        }

        let mut pos = inner.positions.snapshot();
        refresh_pnl(&mut pos);

        events
    }

    pub async fn snapshot_book(
        &self,
        symbol: &str,
    ) -> Option<OrderBookSnapshot> {
        let inner = self.inner.lock().await;
        inner.books.get(symbol).map(|b| b.snapshot())
    }
}

pub async fn run_matching_engine_loop(
    engine: MatchingEngine,
    mut rx_orders: mpsc::Receiver<EngineOrder>,
) {
    while let Some(order) = rx_orders.recv().await {
        let _events = engine.submit_order(order).await;

        // No NATS publishing — trading-service is pure engine
    }
}

