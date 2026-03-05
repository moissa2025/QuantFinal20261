INSERT INTO accounts (id, code, name, currency, book)
VALUES
    (gen_random_uuid(), 'SYS_TREASURY_USD', 'System Treasury USD', 'USD', 'production'),
    (gen_random_uuid(), 'SYS_TREASURY_USD_RS', 'System Treasury USD (Risk Shadow)', 'USD', 'risk_shadow');

