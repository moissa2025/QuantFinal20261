use rand::{thread_rng, Rng};
use rand::distributions::Uniform;
use chrono::{Utc, Duration};
use sqlx::PgPool;
use uuid::Uuid;

pub fn generate_email_otp() -> String {
    let mut rng = thread_rng();
    let range = Uniform::new(0, 10);
    (0..6).map(|_| rng.sample(&range).to_string()).collect()
}

pub async fn store_email_otp(
    db: &PgPool,
    user_id: Uuid,
    code: &str,
) -> Result<(), sqlx::Error> {
	let expires_at = (Utc::now() + Duration::minutes(10)).naive_utc();

    sqlx::query!(
        r#"
        INSERT INTO auth.email_otp (user_id, code, expires_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id)
        DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at
        "#,
        user_id,
        code,
        expires_at
    )
    .execute(db)
    .await?;

    Ok(())
}

