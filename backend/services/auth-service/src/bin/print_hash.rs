use auth_service::password::hash_password;

fn main() {
    let hash = hash_password("password").unwrap();
    println!("{}", hash);
}

