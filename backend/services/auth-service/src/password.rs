use argon2::{
    Argon2,
    Algorithm,
    Params,
    Version,
    PasswordHash,
    PasswordHasher,
    PasswordVerifier,
};
use argon2::password_hash::{SaltString, Error as PasswordError};
use rand::thread_rng;

//
// Hash a password using Argon2id with your exact parameters
//
pub fn hash_password(password: &str) -> Result<String, PasswordError> {
    let salt = SaltString::generate(&mut thread_rng());

    // Match your generator parameters
    let params = Params::new(65536, 3, 4, None).unwrap();
    let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, params);

    let hash = argon2.hash_password(password.as_bytes(), &salt)?;
    Ok(hash.to_string())
}

//
// Verify a password using the same parameters
//
pub fn verify_password(password: &str, hash: &str) -> Result<bool, PasswordError> {
    let parsed = PasswordHash::new(hash)?;

    // Same parameters as hash_password()
    let params = Params::new(65536, 3, 4, None).unwrap();
    let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, params);

    Ok(argon2.verify_password(password.as_bytes(), &parsed).is_ok())
}

