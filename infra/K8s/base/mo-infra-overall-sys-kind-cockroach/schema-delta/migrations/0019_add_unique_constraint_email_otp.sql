USE gqx_db;

ALTER TABLE auth.email_otp
ADD CONSTRAINT email_otp_user_unique UNIQUE (user_id);

INSERT INTO schema_migrations (version) VALUES (19);

