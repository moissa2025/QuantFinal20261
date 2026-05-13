use async_nats::Client;
use serde::{Serialize, de::DeserializeOwned};
use anyhow::Result;

#[derive(Clone)]
pub struct Messaging {
    pub client: Client,
}

impl Messaging {
    pub fn new(client: Client) -> Self {
        Self { client }
    }

    /// Generic RPC call using NATS request/reply
    pub async fn rpc<Req, Res>(&self, subject: &str, req: &Req) -> Result<Res>
    where
        Req: Serialize,
        Res: DeserializeOwned,
    {
        let payload = serde_json::to_vec(req)?;

        // ⭐ FIX: convert &str → String so async-nats gets an owned subject
        let msg = self
            .client
            .request(subject.to_string(), payload.into())
            .await?;

        let res = serde_json::from_slice::<Res>(&msg.payload)?;
        Ok(res)
    }
}
