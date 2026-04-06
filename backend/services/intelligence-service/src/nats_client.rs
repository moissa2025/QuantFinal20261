use async_nats::Client;
use serde::{Serialize, de::DeserializeOwned};
use anyhow::Result;

#[derive(Clone)]
pub struct NatsClient {
    pub inner: Client,
}

impl NatsClient {
    pub async fn connect(url: &str) -> Result<Self> {
        let inner = async_nats::connect(url).await?;
        Ok(Self { inner })
    }
pub async fn request<Req, Res>(&self, subject: &'static str, req: &Req) -> Result<Res>
where
    Req: serde::Serialize,
    Res: serde::de::DeserializeOwned,
{
    let payload = serde_json::to_vec(req)?;
    let msg = self.inner.request(subject, payload.into()).await?;
    let res: Res = serde_json::from_slice(&msg.payload)?;
    Ok(res)
}



}

