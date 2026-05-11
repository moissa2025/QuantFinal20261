use reqwest::Client;
use rsa::pkcs8::DecodePrivateKey;
use rsa::pkcs1v15::SigningKey;
use rsa::RsaPrivateKey;
use sha2::{Sha256, Digest};
use signature::hazmat::PrehashSigner;

pub struct BinanceClient {
    pub(crate) api_key: String,
    pub(crate) rsa_private_key: String,
    pub(crate) http: Client,
}

impl BinanceClient {
    pub fn new(api_key: String, rsa_private_key: String) -> Self {
        Self {
            api_key,
            rsa_private_key,
            http: Client::new(),
        }
    }

    pub async fn ping(&self) -> Result<(), reqwest::Error> {
        let url = "https://api.binance.com/api/v3/ping";
        self.http
            .get(url)
            .send()
            .await?
            .error_for_status()?;
        Ok(())
    }

    pub fn sign(&self, message: &str) -> String {
        // Load RSA private key (PKCS#8)
        let private_key = RsaPrivateKey::from_pkcs8_pem(&self.rsa_private_key)
            .expect("Invalid RSA private key");

        // Create PKCS#1 v1.5 signing key
        let signing_key = SigningKey::<Sha256>::new(private_key);

        // Hash the message
        let digest = Sha256::digest(message.as_bytes());

        // Sign the SHA256 digest
        let signature = signing_key.sign_prehash(&digest)
            .expect("RSA signing failed");

        // Return hex-encoded signature
        hex::encode(signature)
    }
}

