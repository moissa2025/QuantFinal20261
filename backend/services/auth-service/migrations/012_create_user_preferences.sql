-- Preferences for notifications, UI, privacy, etc.
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    dark_mode BOOLEAN NOT NULL DEFAULT FALSE,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

