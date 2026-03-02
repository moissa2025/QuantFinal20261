use async_nats::Client;
use serde::{de::DeserializeOwned, Serialize};
use thiserror::Error;

#[derive(Clone)]
pub struct NatsClient {
    inner: Client,
}

#[derive(Debug, Error)]
pub enum NatsError {
    #[error("nats connection error: {0}")]
    Connection(String),
    #[error("nats request error: {0}")]
    Request(String),
    #[error("serialization error: {0}")]
    Serialization(String),
    #[error("deserialization error: {0}")]
    Deserialization(String),
}

impl NatsClient {
    pub async fn connect(url: String) -> Result<Self, NatsError> {
        let inner = async_nats::connect(url)
            .await
            .map_err(|e| NatsError::Connection(e.to_string()))?;

        Ok(Self { inner })
    }

    pub async fn rpc<Req, Res>(&self, subject: &str, req: &Req) -> Result<Res, NatsError>
    where
        Req: Serialize,
        Res: DeserializeOwned,
    {
        let payload = serde_json::to_vec(req)
            .map_err(|e| NatsError::Serialization(e.to_string()))?;

        let msg = self
            .inner
            .request(subject.to_string(), payload.into())
            .await
            .map_err(|e| NatsError::Request(e.to_string()))?;

        let res = serde_json::from_slice::<Res>(&msg.payload)
            .map_err(|e| NatsError::Deserialization(e.to_string()))?;

        Ok(res)
    }
}

