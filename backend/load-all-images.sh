#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "❌ No tag provided."
  echo "Usage: ./load-all-images.sh v0.0.1"
  exit 1
fi

TAG=$1

# Auto-detect KIND cluster name
CLUSTER=$(kind get clusters | head -n 1)

if [ -z "$CLUSTER" ]; then
  echo "❌ No KIND clusters found!"
  exit 1
fi

echo "📥 Loading images into KIND cluster '$CLUSTER'..."
echo "🔖 Using tag: $TAG"
echo ""

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

for svc in "${SERVICES[@]}"; do
  echo "----------------------------------------"
  echo "📤 Loading $svc:$TAG into KIND ($CLUSTER)"
  kind load docker-image $svc:$TAG --name "$CLUSTER"
done

echo ""
echo "✅ All images loaded into KIND cluster '$CLUSTER' with tag: $TAG"

