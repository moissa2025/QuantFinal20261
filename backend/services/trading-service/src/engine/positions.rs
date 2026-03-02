use std::collections::HashMap;

use common::trading::Position;
use super::types::{Side, MatchEvent};

#[derive(Debug, Default)]
pub struct PositionEngine {
    positions: HashMap<String, Position>, // key: symbol
}

impl PositionEngine {
    pub fn new() -> Self {
        Self {
            positions: HashMap::new(),
        }
    }

    pub fn apply_match(&mut self, ev: &MatchEvent, side: Side) {
        let pos = self.positions.entry(ev.symbol.clone()).or_insert(Position {
            symbol: ev.symbol.clone(),
            side: match side {
                Side::Buy => "LONG".into(),
                Side::Sell => "SHORT".into(),
            },
            size: 0.0,
            entry: ev.price,
            mark: ev.price,
            pnl: 0.0,
        });

        // simple net position model
        if side == Side::Buy {
            pos.size += ev.size;
        } else {
            pos.size -= ev.size;
        }

        pos.mark = ev.price;
    }

    pub fn snapshot(&self) -> Vec<Position> {
        self.positions.values().cloned().collect()
    }
}

