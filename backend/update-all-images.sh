#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "❌ No tag provided."
  echo "Usage: ./update-all-images.sh v0.0.6"
  exit 1
fi

TAG=$1
NS="trading-platform"

SERVICES=(
  wallet-service
  api-gateway
  auth-service
  user-service
  onboarding-service
  trading-service
  risk-service
  ledger-service
  kyc-service
  aml-monitoring-service
  intelligence-service
  reconciliation-service
  market-data-service
)

echo "🔄 Updating all deployments in namespace '$NS' to tag: $TAG"
echo ""

for svc in "${SERVICES[@]}"; do
  echo "----------------------------------------"
  echo "📌 Updating $svc → $TAG"

  kubectl set image deployment/$svc \
    $svc=$svc:$TAG \
    -n $NS

  echo "⏳ Waiting for rollout..."
  kubectl rollout status deployment/$svc -n $NS
done

echo ""
echo "✅ All deployments updated to tag: $TAG"

