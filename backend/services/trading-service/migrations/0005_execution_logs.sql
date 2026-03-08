-- 0005_create_execution_logs.sql

CREATE TABLE execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intent_id UUID REFERENCES trade_intents(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    venue_order_id TEXT,
    symbol TEXT NOT NULL,
    side TEXT NOT NULL,
    status TEXT NOT NULL,             -- SENT / ACK / FILLED / CANCELLED / ERROR
    message TEXT,
    payload JSONB,                    -- raw exchange response
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_execution_logs_order_id ON execution_logs(order_id);
CREATE INDEX idx_execution_logs_intent_id ON execution_logs(intent_id);

