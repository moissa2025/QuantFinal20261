#!/bin/bash

NAMESPACE="trading-platform"

echo "🩺 Health Check — All Services"
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
  ready=$(kubectl get deploy/$svc -n $NAMESPACE -o jsonpath='{.status.readyReplicas}' 2>/dev/null)
  total=$(kubectl get deploy/$svc -n $NAMESPACE -o jsonpath='{.status.replicas}' 2>/dev/null)

  if [[ -z "$total" ]]; then
    echo "❌ $svc — NOT FOUND"
  elif [[ "$ready" == "$total" ]]; then
    echo "✅ $svc — READY ($ready/$total)"
  else
    echo "⚠️  $svc — NOT READY ($ready/$total)"
  fi
done

