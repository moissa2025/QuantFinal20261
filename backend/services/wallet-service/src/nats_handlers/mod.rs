use futures_util::StreamExt;
use async_nats::Client;
use crate::db::DbPool;

mod response;
mod create_account;
mod get_balance;
mod credit;
mod debit;
mod transfer;

pub async fn start_nats_listeners(nats: Client, pool: DbPool) {
    // wallet.account.create
    {
        let nc = nats.clone();
        let pool = pool.clone();
        tokio::spawn(async move {
            let mut sub = nc.subscribe("wallet.account.create").await.unwrap();
            while let Some(msg) = sub.next().await {
                let resp = create_account::handle_create_account(pool.clone(), &msg.payload).await;

                if let Some(reply) = msg.reply {
                    let _ = nc.publish(reply, serde_json::to_vec(&resp).unwrap().into()).await;
                }
            }
        });
    }

    // wallet.balance.get
    {
        let nc = nats.clone();
        let pool = pool.clone();
        tokio::spawn(async move {
            let mut sub = nc.subscribe("wallet.balance.get").await.unwrap();
            while let Some(msg) = sub.next().await {
                let resp = get_balance::handle_get_balance(pool.clone(), &msg.payload).await;

                if let Some(reply) = msg.reply {
                    let _ = nc.publish(reply, serde_json::to_vec(&resp).unwrap().into()).await;
                }
            }
        });
    }

    // wallet.credit
    {
        let nc = nats.clone();
        let pool = pool.clone();
        tokio::spawn(async move {
            let mut sub = nc.subscribe("wallet.credit").await.unwrap();
            while let Some(msg) = sub.next().await {
                let resp = credit::handle_credit(pool.clone(), &msg.payload).await;

                if let Some(reply) = msg.reply {
                    let _ = nc.publish(reply, serde_json::to_vec(&resp).unwrap().into()).await;
                }
            }
        });
    }

    // wallet.debit
    {
        let nc = nats.clone();
        let pool = pool.clone();
        tokio::spawn(async move {
            let mut sub = nc.subscribe("wallet.debit").await.unwrap();
            while let Some(msg) = sub.next().await {
                let resp = debit::handle_debit(pool.clone(), &msg.payload).await;

                if let Some(reply) = msg.reply {
                    let _ = nc.publish(reply, serde_json::to_vec(&resp).unwrap().into()).await;
                }
            }
        });
    }

    // wallet.transfer
    {
        let nc = nats.clone();
        let pool = pool.clone();
        tokio::spawn(async move {
            let mut sub = nc.subscribe("wallet.transfer").await.unwrap();
            while let Some(msg) = sub.next().await {
                let resp = transfer::handle_transfer(pool.clone(), &msg.payload).await;

                if let Some(reply) = msg.reply {
                    let _ = nc.publish(reply, serde_json::to_vec(&resp).unwrap().into()).await;
                }
            }
        });
    }

    println!("wallet-service: NATS listeners started");
}

