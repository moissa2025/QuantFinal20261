#!/bin/bash

NAMESPACE="trading-platform"

echo "📜 Following logs for all services..."
echo "Press CTRL+C to stop."
echo "=============================================="

services=(
  "auth-service"
  "user-service"
  "kyc-service"
  "onboarding-service"
  "wallet-service"
  "ledger-service"
  "reconciliation-service"
  "market-data-service"
  "intelligence-service"
  "risk-service"
  "trading-service"
  "aml-monitoring-service"
  "api-gateway"
)

for svc in "${services[@]}"; do
  echo "▶️  Starting logs for $svc"
  kubectl logs -n $NAMESPACE -l app=$svc -f --tail=50 | sed "s/^/[$svc] /" &
done

wait

