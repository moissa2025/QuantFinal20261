#!/bin/bash

NAMESPACE="trading-platform"
DB="globalquantx"
DATE=$(date +"%Y-%m-%d_%H-%M")

echo "🗄️  Starting CockroachDB backup for database: $DB"
echo "================================================="

echo "⏳ Port-forwarding CockroachDB..."
kubectl port-forward -n $NAMESPACE svc/cockroachdb-public 26257:26257 >/dev/null 2>&1 &
PF_PID=$!

sleep 3

echo "📦 Dumping database..."
cockroach dump $DB \
  --insecure \
  --host=localhost:26257 \
  --dump-mode=data \
  --file=backup-$DB-$DATE.sql

echo "🛑 Stopping port-forward..."
kill $PF_PID

echo "✅ Backup complete: backup-$DB-$DATE.sql"

