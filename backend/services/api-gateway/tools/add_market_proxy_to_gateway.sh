#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🚀 Adding market-data reverse proxy to API Gateway...");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const ROUTES = path.join(SRC, "routes");
const MAIN = path.join(SRC, "main.rs");
const MOD = path.join(ROUTES, "mod.rs");

// Ensure directories exist
if (!fs.existsSync(ROUTES)) fs.mkdirSync(ROUTES, { recursive: true });

// 1. Write market_proxy.rs
const proxyFile = path.join(ROUTES, "market_proxy.rs");

const proxyContent = `use axum::{
    extract::{State, WebSocketUpgrade},
    response::IntoResponse,
    routing::get,
};
use hyper::Client;
use futures_util::{StreamExt, SinkExt};
use tokio_tungstenite::connect_async;
use crate::state::AppState;

pub async fn proxy_snapshot(State(_state): State<AppState>) -> impl IntoResponse {
    let uri = "http://market-data-service:8081/market-data/snapshot"
        .parse()
        .unwrap();

    let client = Client::new();
    match client.get(uri).await {
        Ok(res) => res.into_response(),
        Err(_) => axum::http::StatusCode::BAD_GATEWAY.into_response(),
    }
}

pub async fn proxy_stream(ws: WebSocketUpgrade) -> impl IntoResponse {
    ws.on_upgrade(|socket| async move {
        let (mut internal_ws, _) =
            connect_async("ws://market-data-service:8081/market-stream")
                .await
                .expect("failed to connect to internal market stream");

        let (mut client_tx, mut client_rx) = socket.split();
        let (mut internal_tx, mut internal_rx) = internal_ws.split();

        tokio::spawn(async move {
            while let Some(Ok(msg)) = internal_rx.next().await {
                let _ = client_tx.send(msg).await;
            }
        });

        tokio::spawn(async move {
            while let Some(Ok(msg)) = client_rx.next().await {
                let _ = internal_tx.send(msg).await;
            }
        });
    })
}
`;

fs.writeFileSync(proxyFile, proxyContent);
console.log(`✅ Created: ${proxyFile}`);

// 2. Ensure mod entry exists
let modContent = fs.readFileSync(MOD, "utf8");
if (!modContent.includes("pub mod market_proxy;")) {
  modContent += "\npub mod market_proxy;\n";
  fs.writeFileSync(MOD, modContent);
  console.log("🔧 Added 'pub mod market_proxy;' to routes/mod.rs");
} else {
  console.log("ℹ️  'pub mod market_proxy;' already exists");
}

// 3. Patch main.rs
let mainContent = fs.readFileSync(MAIN, "utf8");

const block = `
        .nest(
            "/market-data",
            Router::new()
                .route("/snapshot", get(routes::market_proxy::proxy_snapshot))
                .route("/stream", get(routes::market_proxy::proxy_stream))
        )
`;

if (!mainContent.includes('"/market-data"')) {
  mainContent = mainContent.replace(
    "// PROTECTED ROUTES",
    `// PROTECTED ROUTES${block}`
  );
  fs.writeFileSync(MAIN, mainContent);
  console.log("🔧 Added /market-data routes to main.rs");
} else {
  console.log("ℹ️  /market-data routes already present in main.rs");
}

console.log("🎉 Market-data reverse proxy successfully integrated!");

