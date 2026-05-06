#!/bin/bash
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
  intelligence-service
  market-data-service
  ledger-service
  reconciliation-service
  aml-monitoring-service
)

echo "🛑 Terminating all services (scaling to 0)…"

for svc in "${SERVICES[@]}"; do
  echo "⛔ $svc → 0 replicas"
  kubectl scale deployment "$svc" --replicas=0 -n $NAMESPACE
done

echo "✅ All services scaled down to 0."

