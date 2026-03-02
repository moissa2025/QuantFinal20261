use std::sync::Arc;

use tokio::sync::{Mutex, mpsc};

use common::trading::{Order, Position};
use crate::engine::{matcher::{MatchingEngine, run_matching_engine_loop}, types::EngineOrder};

#[derive(Clone)]
pub struct AppState {
    pub orders: Arc<Mutex<Vec<Order>>>,
    pub positions: Arc<Mutex<Vec<Position>>>,
    pub engine: MatchingEngine,
    pub order_tx: mpsc::Sender<EngineOrder>,
}

impl AppState {
    pub fn new() -> Arc<Self> {
        let (order_tx, order_rx) = mpsc::channel::<EngineOrder>(1024);

        let engine = MatchingEngine::new();
        let engine_clone = engine.clone();

        // Spawn matching engine loop
        tokio::spawn(async move {
            run_matching_engine_loop(engine_clone, order_rx).await;
        });

        Arc::new(Self {
            orders: Arc::new(Mutex::new(vec![])),
            positions: Arc::new(Mutex::new(vec![])),
            engine,
            order_tx,
        })
    }
}

