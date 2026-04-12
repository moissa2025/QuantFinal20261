#!/bin/bash

NAMESPACE="trading-platform"
DB="globalquantx"

echo "🧪 Verifying CockroachDB schema"
echo "==============================="

echo "⏳ Port-forwarding CockroachDB..."
kubectl port-forward -n $NAMESPACE svc/cockroachdb-public 26257:26257 >/dev/null 2>&1 &
PF_PID=$!

sleep 3

echo "📂 Listing tables..."
cockroach sql --insecure --host=localhost:26257 -e "SHOW TABLES FROM $DB;"

echo "🛑 Stopping port-forward..."
kill $PF_PID

echo "✅ Schema verification complete."

