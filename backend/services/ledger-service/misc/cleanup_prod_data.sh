#!/bin/bash

POSTGRES_POD="postgres"

echo "Using Postgres pod: $POSTGRES_POD"

kubectl exec -n infra -it "$POSTGRES_POD" -- psql -U bassteck -d trading <<'EOF'
DELETE FROM journal_entries
WHERE account_id IN (
    SELECT id FROM accounts WHERE name = 'Test Account'
);

DELETE FROM accounts
WHERE name = 'Test Account';
EOF
