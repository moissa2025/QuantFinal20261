#!/bin/bash

NAMESPACE="trading-platform"

echo "🛰️  Verifying NATS connectivity"
echo "==============================="

kubectl exec -n $NAMESPACE deploy/nats -- \
  nats-server --version

echo "📡 Checking NATS port..."
kubectl exec -n $NAMESPACE deploy/nats -- \
  bash -c "nc -z localhost 4222 && echo '✅ NATS port open' || echo '❌ NATS port closed'"

echo "📦 Checking JetStream..."
kubectl exec -n $NAMESPACE deploy/nats -- \
  nats --server nats://localhost:4222 js info || echo "❌ JetStream not responding"

echo "✅ NATS verification complete."

