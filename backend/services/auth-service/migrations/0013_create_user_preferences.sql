CREATE TABLE auth.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    dark_mode BOOLEAN NOT NULL DEFAULT FALSE,
    language TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

