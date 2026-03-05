use aes_gcm::{Aes256Gcm, KeyInit, aead::{Aead, OsRng, generic_array::GenericArray}};
use sha2::{Sha256, Digest};
use base64::engine::general_purpose::STANDARD;
use base64::Engine;
use rand_core::RngCore;

#[derive(Debug, thiserror::Error)]
pub enum RefreshTokenError {
    #[error("missing REFRESH_TOKEN_KEY env var")]
    MissingKey,
    #[error("invalid base64 key")]
    InvalidKey,
    #[error("encryption error")]
    Encrypt,
    #[error("decryption error")]
    Decrypt,
}

fn cipher() -> Result<Aes256Gcm, RefreshTokenError> {
    let key_b64 = std::env::var("REFRESH_TOKEN_KEY")
        .map_err(|_| RefreshTokenError::MissingKey)?;
    let key_bytes = STANDARD
        .decode(key_b64)
        .map_err(|_| RefreshTokenError::InvalidKey)?;

    if key_bytes.len() != 32 {
        return Err(RefreshTokenError::InvalidKey);
    }

    let key = GenericArray::from_slice(&key_bytes);
    Ok(Aes256Gcm::new(key))
}

pub fn generate_refresh_token() -> String {
    let mut bytes = [0u8; 32];
    OsRng.fill_bytes(&mut bytes);
    STANDARD.encode(bytes)
}

pub fn hash_refresh_token(token: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(token.as_bytes());
    format!("{:x}", hasher.finalize())
}

pub fn encrypt_refresh_token(plaintext: &str) -> Result<(Vec<u8>, Vec<u8>), RefreshTokenError> {
    let cipher = cipher()?;

    let mut nonce_bytes = [0u8; 12];
    OsRng.fill_bytes(&mut nonce_bytes);
    let nonce = GenericArray::from_slice(&nonce_bytes);

    let ciphertext = cipher
        .encrypt(nonce, plaintext.as_bytes())
        .map_err(|_| RefreshTokenError::Encrypt)?;

    Ok((ciphertext, nonce_bytes.to_vec()))
}

pub fn decrypt_refresh_token(ciphertext: &[u8], nonce: &[u8]) -> Result<String, RefreshTokenError> {
    let cipher = cipher()?;

    if nonce.len() != 12 {
        return Err(RefreshTokenError::Decrypt);
    }

    let nonce = GenericArray::from_slice(nonce);

    let plaintext = cipher
        .decrypt(nonce, ciphertext)
        .map_err(|_| RefreshTokenError::Decrypt)?;

    String::from_utf8(plaintext).map_err(|_| RefreshTokenError::Decrypt)
}

