use reqwest::Client;

pub struct BinanceClient {
    pub(crate) api_key: String,
    pub(crate) api_secret: String,
    pub(crate) http: Client,
}

impl BinanceClient {
    pub fn new(api_key: String, api_secret: String) -> Self {
        Self {
            api_key,
            api_secret,
            http: Client::new(),
        }
    }

    pub async fn ping(&self) -> Result<(), reqwest::Error> {
        let url = "https://api.binance.com/api/v3/ping";
        self.http
            .get(url)
            .send()
            .await?
            .error_for_status()?; // ensures 4xx/5xx become errors
        Ok(())
    }
}

