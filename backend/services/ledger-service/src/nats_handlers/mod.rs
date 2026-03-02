use async_nats::Client;
use crate::db::DbPool;

pub mod ensure_account;
pub mod get_balance;
pub mod get_history;
pub mod record_journal;

pub async fn start_nats_listeners(_nats: Client, _pool: DbPool) {
    // TODO: wire subscriptions here, e.g.:
    // let pool = Arc::new(pool);
    // let nats = Arc::new(nats);
    //
    // nats.subscribe("ledger.ensure_account").await?;
    // etc.
}

