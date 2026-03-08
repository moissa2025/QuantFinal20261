mod db;

use db::init_db;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    println!("reconciliation-service starting…");

    let pool = init_db()
        .await
        .expect("Failed to initialize database");

    println!("reconciliation-service running with DB connectivity");

    Ok(())
}

