use async_nats::Client;
use futures_util::StreamExt;
use tracing::info;

pub async fn subscribe_to_events(nc: Client) {
    let mut sub = nc.subscribe("onboarding.start").await.unwrap();

    tokio::spawn(async move {
        while let Some(msg) = sub.next().await {
            info!("Received onboarding event: {:?}", msg);
        }
    });
}

