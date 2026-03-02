mod db;
mod models;
mod repository;
mod nats_handlers;

use async_nats::connect;
use db::init_db;

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    let pool = init_db().await.expect("Failed to init DB");

    let nats_url = std::env::var("NATS_URL")
        .expect("NATS_URL must be set");

    let nats = connect(&nats_url).await.unwrap();

    nats_handlers::start_nats_listeners(nats, pool).await;
}

