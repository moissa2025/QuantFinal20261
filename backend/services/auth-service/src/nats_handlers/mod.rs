// Declare all submodules
pub mod register;
pub mod activate;
pub mod login;
pub mod refresh;
pub mod validate_session;
pub mod logout;
pub mod mfa_verify;
pub mod mfa_setup;

use async_nats::Client;
use sqlx::PgPool;

use register::handle_register;
use activate::handle_activate;
use login::handle_login;
use refresh::handle_refresh;
use validate_session::handle_validate_session;
use logout::handle_logout;
use mfa_verify::handle_mfa_verify;
use mfa_setup::handle_mfa_setup;

pub async fn start_nats_listeners(nats: Client, db: PgPool) {
    tokio::spawn(handle_register(nats.clone(), db.clone()));
    tokio::spawn(handle_activate(nats.clone(), db.clone()));
    tokio::spawn(handle_login(nats.clone(), db.clone()));
    tokio::spawn(handle_refresh(nats.clone(), db.clone()));
    tokio::spawn(handle_validate_session(nats.clone(), db.clone()));
    tokio::spawn(handle_logout(nats.clone(), db.clone()));
    tokio::spawn(handle_mfa_verify(nats.clone(), db.clone()));
    tokio::spawn(handle_mfa_setup(nats.clone(), db.clone()));
}

