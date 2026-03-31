fn main() {
    let hash = auth_service::password::hash_password("password").unwrap();
    println!("{}", hash);
}

