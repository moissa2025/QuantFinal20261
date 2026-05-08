use anyhow::{Result, anyhow};
use async_nats::{Client, Subscriber};
use futures_util::StreamExt;
use serde::{Serialize, de::DeserializeOwned};
use tokio::time::{timeout, Duration};

#[derive(Clone)]
pub struct Messaging {
    client: Client,
}

impl Messaging {
    pub async fn connect(nats_url: &str) -> Result<Self> {
        let client = async_nats::connect(nats_url).await?;
        Ok(Self { client })
    }

    //
    // PUBLISH RAW BYTES
    //
    pub async fn publish(&self, subject: &str, data: Vec<u8>) -> Result<()> {
        self.client.publish(subject, data.into()).await?;
        Ok(())
    }

    //
    // PUBLISH JSON
    //
    pub async fn publish_json<T: Serialize>(&self, subject: String, value: &T) -> Result<()> {
        let data = serde_json::to_vec(value)?;
        self.publish(subject, data).await
    }

    //
    // SUBSCRIBE TO JSON STREAM
    //
    pub async fn subscribe_json<T>(&self, subject: String)
        -> Result<impl futures_util::Stream<Item = Result<T>>>
    where
        T: DeserializeOwned + Send + 'static,
    {
        let sub: Subscriber = self.client.subscribe(subject).await?;

        let stream = sub.map(|msg| {
            let data = msg.payload.to_vec();
            let parsed = serde_json::from_slice::<T>(&data)
                .map_err(|e| anyhow!("JSON decode error: {}", e));
            parsed
        });

        Ok(stream)
    }

    //
    // RPC REQUEST/RESPONSE
    //
    pub async fn rpc<Req, Res>(&self, subject: String, req: &Req) -> Result<Res>
    where
        Req: Serialize,
        Res: DeserializeOwned,
    {
        let payload = serde_json::to_vec(req)?;
        let inbox = self.client.new_inbox(); // this is a String
        let mut sub = self.client.subscribe(inbox.clone()).await?;

        self.client
            .publish_with_reply(subject, inbox, payload.into())
            .await?;

        let msg = timeout(Duration::from_secs(3), sub.next())
            .await
            .map_err(|_| anyhow!("RPC timeout"))?
            .ok_or_else(|| anyhow!("RPC stream closed"))?;

        let parsed = serde_json::from_slice::<Res>(&msg.payload)
            .map_err(|e| anyhow!("RPC decode error: {}", e))?;

        Ok(parsed)
    }
}

