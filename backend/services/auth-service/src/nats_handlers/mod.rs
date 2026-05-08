use async_nats::Client;
use sqlx::PgPool;
use futures_util::StreamExt;

pub mod login;
pub mod logout;
pub mod refresh;
pub mod validate_session;
pub mod introspect_session;
pub mod mfa_verify;
pub mod mfa_setup;
pub mod register;
pub mod activate;

use register::handle_register;
use activate::handle_activate;
use login::handle_login;
use logout::handle_logout;
use refresh::handle_refresh;
use validate_session::handle_validate_session;
use mfa_verify::handle_mfa_verify;
use mfa_setup::handle_mfa_setup;
use introspect_session::handle_introspect_session;

pub async fn start_nats_listeners(nats: Client, db: PgPool) {
    macro_rules! spawn_listener {
        ($subject:expr, $handler:expr) => {{
            let sub = nats.subscribe($subject).await.unwrap();
            let nats_clone = nats.clone();
            let db_clone = db.clone();

            tokio::spawn(async move {
                let mut sub = sub;
                while let Some(msg) = sub.next().await {
                    $handler(db_clone.clone(), nats_clone.clone(), msg).await;
                }
            });
        }};
    }

    spawn_listener!("auth.register.request", handle_register);
    spawn_listener!("auth.activate.request", handle_activate);
    spawn_listener!("auth.login.request", handle_login);
    spawn_listener!("auth.refresh.request", handle_refresh);
    spawn_listener!("auth.validate_session.request", handle_validate_session);
    spawn_listener!("auth.logout.request", handle_logout);
    spawn_listener!("auth.mfa.verify.request", handle_mfa_verify);
    spawn_listener!("auth.mfa.setup.request", handle_mfa_setup);
    spawn_listener!("auth.session.introspect.request", handle_introspect_session);
}

