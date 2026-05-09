use std::collections::BTreeMap;

use common::trading::{OrderBookSnapshot, OrderBookSide};
use super::types::{EngineOrder, Side, MatchEvent, EngineEvent};

type Price = i64; // integer price in ticks (e.g. price * 100)

#[derive(Debug, Default)]
pub struct PriceLevel {
    pub price: f64,              // human-readable price
    pub total_size: f64,
    pub orders: Vec<EngineOrder>,
}

#[derive(Debug, Default)]
pub struct OrderBook {
    pub symbol: String,
    pub bids: BTreeMap<Price, PriceLevel>, // key: integer price (descending)
    pub asks: BTreeMap<Price, PriceLevel>, // key: integer price (ascending)
}

impl OrderBook {
    pub fn new(symbol: String) -> Self {
        Self {
            symbol,
            bids: BTreeMap::new(),
            asks: BTreeMap::new(),
        }
    }

    pub fn best_bid(&self) -> Option<&PriceLevel> {
        self.bids.iter().rev().next().map(|(_, lvl)| lvl)
    }

    pub fn best_ask(&self) -> Option<&PriceLevel> {
        self.asks.iter().next().map(|(_, lvl)| lvl)
    }

    pub fn snapshot(&self) -> OrderBookSnapshot {
        OrderBookSnapshot {
            bids: self
                .bids
                .iter()
                .rev()
                .map(|(_, lvl)| OrderBookSide {
                    price: lvl.price,
                    size: lvl.total_size,
                })
                .collect(),
            asks: self
                .asks
                .iter()
                .map(|(_, lvl)| OrderBookSide {
                    price: lvl.price,
                    size: lvl.total_size,
                })
                .collect(),
        }
    }

    pub fn add_limit_order(
        &mut self,
        order: EngineOrder,
    ) -> Vec<EngineEvent> {
        let mut events = Vec::new();

        match order.side {
            Side::Buy => {
                self.match_against_asks(order, &mut events);
            }
            Side::Sell => {
                self.match_against_bids(order, &mut events);
            }
        }

        events
    }

    fn match_against_asks(
        &mut self,
        mut taker: EngineOrder,
        events: &mut Vec<EngineEvent>,
    ) {
        let mut to_remove = Vec::new();

        let mut keys: Vec<Price> = self.asks.keys().cloned().collect();
        keys.sort(); // ascending

        for key in keys {
            if taker.size <= 0.0 {
                break;
            }

            if let Some(level) = self.asks.get_mut(&key) {
                let price = level.price;

                if price > taker.price {
                    break;
                }

                let mut i = 0;
                while i < level.orders.len() && taker.size > 0.0 {
                    let maker = &mut level.orders[i];

                    let trade_size = taker.size.min(maker.size);
                    taker.size -= trade_size;
                    maker.size -= trade_size;

                    events.push(EngineEvent::Match(MatchEvent {
                        taker_order_id: taker.id.clone(),
                        maker_order_id: maker.id.clone(),
                        symbol: taker.symbol.clone(),
                        price,
                        size: trade_size,
                    }));

                    if maker.size <= 0.0 {
                        level.total_size -= trade_size;
                        level.orders.remove(i);
                    } else {
                        level.total_size -= trade_size;
                        i += 1;
                    }
                }

                if level.orders.is_empty() {
                    to_remove.push(key);
                }
            }
        }

        for p in to_remove {
            self.asks.remove(&p);
        }

        if taker.size > 0.0 {
            self.insert_resting_order(taker);
        }
    }

    fn match_against_bids(
        &mut self,
        mut taker: EngineOrder,
        events: &mut Vec<EngineEvent>,
    ) {
        let mut to_remove = Vec::new();

        let mut keys: Vec<Price> = self.bids.keys().cloned().collect();
        keys.sort_by(|a, b| b.cmp(a)); // descending

        for key in keys {
            if taker.size <= 0.0 {
                break;
            }

            if let Some(level) = self.bids.get_mut(&key) {
                let price = level.price;

                if price < taker.price {
                    break;
                }

                let mut i = 0;
                while i < level.orders.len() && taker.size > 0.0 {
                    let maker = &mut level.orders[i];

                    let trade_size = taker.size.min(maker.size);
                    taker.size -= trade_size;
                    maker.size -= trade_size;

                    events.push(EngineEvent::Match(MatchEvent {
                        taker_order_id: taker.id.clone(),
                        maker_order_id: maker.id.clone(),
                        symbol: taker.symbol.clone(),
                        price,
                        size: trade_size,
                    }));

                    if maker.size <= 0.0 {
                        level.total_size -= trade_size;
                        level.orders.remove(i);
                    } else {
                        level.total_size -= trade_size;
                        i += 1;
                    }
                }

                if level.orders.is_empty() {
                    to_remove.push(key);
                }
            }
        }

        for p in to_remove {
            self.bids.remove(&p);
        }

        if taker.size > 0.0 {
            self.insert_resting_order(taker);
        }
    }

    fn insert_resting_order(&mut self, order: EngineOrder) {
        let key: Price = (order.price * 100.0).round() as Price;

        let book_side = match order.side {
            Side::Buy => &mut self.bids,
            Side::Sell => &mut self.asks,
        };

        let level = book_side
            .entry(key)
            .or_insert(PriceLevel {
                price: order.price,
                total_size: 0.0,
                orders: Vec::new(),
            });

        level.total_size += order.size;
        level.orders.push(order);
    }
}

