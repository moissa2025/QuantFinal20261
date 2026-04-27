#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "❌ No tag provided."
  echo "Usage: ./load-all-images.sh v0.0.1"
  exit 1
fi

TAG=$1

SERVICES=(
  auth-service
  api-gateway
  user-service
  onboarding-service
  trading-service
  risk-service
  ledger-service
  wallet-service
  kyc-service
  aml-monitoring-service
  intelligence-service
  reconciliation-service
  market-data-service
)

echo "📥 Loading images into KIND cluster 'globalquantx'..."
echo "🔖 Using tag: $TAG"
echo ""

for svc in "${SERVICES[@]}"; do
  echo "----------------------------------------"
  echo "📤 Loading $svc:$TAG into KIND"
  kind load docker-image $svc:$TAG --name globalquantx
done

echo ""
echo "✅ All images loaded into KIND cluster 'globalquantx' with tag: $TAG"

