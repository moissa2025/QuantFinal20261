ALTER TABLE sessions
    ADD COLUMN IF NOT EXISTS device_hash TEXT;

ALTER TABLE sessions
    ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Optional cleanup: remove legacy column
ALTER TABLE sessions
    DROP COLUMN IF EXISTS last_used_at;

