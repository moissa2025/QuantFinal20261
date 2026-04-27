#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "❌ No tag provided."
  echo "Usage: ./build-all-images.sh v0.0.1"
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

echo "🐳 Building all service images locally (no cache)..."
echo "🔖 Using tag: $TAG"
echo ""

for svc in "${SERVICES[@]}"; do
  echo "----------------------------------------"
  echo "📦 Building $svc"
  docker build --no-cache -t $svc:$TAG -t $svc:latest -f services/$svc/Dockerfile .
done

echo ""
echo "✅ All images built locally with tag: $TAG (no cache)"

