use rand::Rng;

pub fn generate_btc_address() -> String {
    format!("bc1{}", hex::encode(rand::thread_rng().gen::<[u8; 20]>()))
}

pub fn generate_eth_address() -> String {
    format!("0x{}", hex::encode(rand::thread_rng().gen::<[u8; 20]>()))
}

