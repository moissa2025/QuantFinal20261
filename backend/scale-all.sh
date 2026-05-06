#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <replica-count>"
  exit 1
fi

REPLICAS=$1
NAMESPACE="trading-platform"

SERVICES=(
  api-gateway
  auth-service
  user-service
  onboarding-service
  kyc-service
  wallet-service
  trading-service
  risk-service
  market-data-service
  ledger-service
  reconciliation-service
  aml-monitoring-service
)

echo "📈 Scaling all services to $REPLICAS replicas…"

for svc in "${SERVICES[@]}"; do
  echo "🔼 $svc → $REPLICAS replicas"
  kubectl scale deployment "$svc" --replicas=$REPLICAS -n $NAMESPACE
done

echo "✅ All services scaled to $REPLICAS."

