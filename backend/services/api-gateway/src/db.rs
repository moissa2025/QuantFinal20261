use sqlx::{Pool, Postgres};
use sqlx::postgres::{PgPoolOptions, PgConnectOptions, PgSslMode};
use std::env;

#[derive(Clone)]
pub struct DbPool(pub Pool<Postgres>);

impl DbPool {
    pub async fn connect_from_env() -> Result<Self, sqlx::Error> {
        // LOCAL OVERRIDE (for dev)
        if let Ok(url) = env::var("LOCAL_DATABASE_URL") {
            println!("📌 Using LOCAL_DATABASE_URL");

            let pool = PgPoolOptions::new()
                .max_connections(10)
                .connect(&url)
                .await?;

            return Ok(Self(pool));
        }

        println!("📌 Using CockroachDB environment variables");

        let user = env::var("DB_USER").expect("DB_USER missing");
        let pass = env::var("DB_PASSWORD").unwrap_or_default();
        let host = env::var("DB_HOST").expect("DB_HOST missing");
        let port = env::var("DB_PORT").unwrap_or_else(|_| "26257".into());
        let name = env::var("DB_NAME").expect("DB_NAME missing");
        let sslmode = env::var("DB_SSLMODE").unwrap_or_else(|_| "disable".into());

        // Build CockroachDB connection options (SQLx 0.6 API)
        let mut options = PgConnectOptions::new()
            .host(&host)
            .username(&user)
            .database(&name)
            .port(port.parse().unwrap())
            .ssl_mode(match sslmode.as_str() {
                "disable" => PgSslMode::Disable,
                "require" => PgSslMode::Require,
                _ => PgSslMode::Disable,
            });

        if !pass.is_empty() {
            options = options.password(&pass);
        }

        // Build the pool using connect_with (SQLx 0.6 correct API)
        let pool = PgPoolOptions::new()
            .max_connections(10)
            .connect_with(options)
            .await?;

        Ok(Self(pool))
    }
}

