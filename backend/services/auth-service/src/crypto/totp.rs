use totp_rs::{Algorithm, TOTP};
use base32::{Alphabet, encode};
use qrcode::QrCode;

pub fn generate_totp_secret() -> String {
    let random_bytes: [u8; 20] = rand::random();
    encode(Alphabet::RFC4648 { padding: false }, &random_bytes)
}

pub fn generate_totp_qr(secret: &str, email: &str) -> Vec<u8> {
    let uri = format!(
        "otpauth://totp/GlobalQuantX:{}?secret={}&issuer=GlobalQuantX",
        email, secret
    );

    let code = QrCode::new(uri.as_bytes()).unwrap();
    code.render::<qrcode::render::svg::Color>().build().into_bytes()
}

pub fn verify_totp(secret: &str, code: &str) -> bool {
    let totp = TOTP::new(
        Algorithm::SHA1,
        6,
        1,
        30,
        secret.as_bytes().to_vec(),
    ).unwrap();

    totp.check_current(code).unwrap_or(false)
}

