use std::sync::Arc;
use futures_util::StreamExt;
use serde::{Serialize, de::DeserializeOwned};
use axum::extract::State;

use crate::{
    state::AppState,
    handlers::{
        home::handle_home,
        market::handle_markets,
        ticker::handle_ticker,
        theme::{handle_theme, ThemeRequest},
        article::{handle_article, ArticleRequest},
    },
    dto::{
        HomeResponse, MarketSnapshot, TickerResponse,
        ThemeResponse, ArticleResponse,
    }
};

pub async fn register_nats_handlers(state: Arc<AppState>) -> anyhow::Result<()> {
    let nc = state.nats.inner.clone();

    // HOME
    subscribe::<(), HomeResponse, _, _>(
        &nc,
        "intelligence.home",
        {
            let state = state.clone();
            move |_| handle_home(State(state.clone()))
        }
    ).await?;

    // MARKETS
    subscribe::<(), MarketSnapshot, _, _>(
        &nc,
        "intelligence.markets",
        {
            let state = state.clone();
            move |_| handle_markets(State(state.clone()))
        }
    ).await?;

    // TICKER
    subscribe::<crate::handlers::ticker::TickerRequest, TickerResponse, _, _>(
        &nc,
        "intelligence.ticker",
        {
            let state = state.clone();
            move |req| handle_ticker(State(state.clone()), req.symbol)
        }
    ).await?;

    // THEME
    subscribe::<ThemeRequest, Option<ThemeResponse>, _, _>(
        &nc,
        "intelligence.theme",
        {
            let state = state.clone();
            move |req| handle_theme(State(state.clone()), req)
        }
    ).await?;

    // ARTICLE
    subscribe::<ArticleRequest, Option<ArticleResponse>, _, _>(
        &nc,
        "intelligence.article",
        {
            let state = state.clone();
            move |req| handle_article(State(state.clone()), req)
        }
    ).await?;

    Ok(())
}
async fn subscribe<Req, Res, F, Fut>(
    nc: &async_nats::Client,
    subject: &'static str,
    handler: F,
) -> anyhow::Result<()>

where
    Req: DeserializeOwned + Send + 'static,
    Res: Serialize + Send + 'static,
    F: Fn(Req) -> Fut + Send + Sync + 'static + Clone,
    Fut: std::future::Future<Output = anyhow::Result<Res>> + Send + 'static,
{
    let sub = nc.subscribe(subject).await?;
    let handler = Arc::new(handler);
    let nc = nc.clone();

    tokio::spawn(async move {
        let mut stream = sub;
        while let Some(msg) = stream.next().await {
            if let Some(reply) = msg.reply.clone() {
                let req: Req = serde_json::from_slice(&msg.payload).unwrap();
                let res = handler(req).await.unwrap();
                let bytes = serde_json::to_vec(&res).unwrap();
                let _ = nc.publish(reply, bytes.into()).await;
            }
        }
    });

    Ok(())
}

