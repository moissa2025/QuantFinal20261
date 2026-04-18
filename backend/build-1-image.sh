#!/bin/bash
set -e

# Validate tag argument
if [ -z "$1" ]; then
  echo "❌ No tag provided."
  echo "Usage: ./build-all-images.sh v0.0.1"
  exit 1
fi

TAG=$1

SERVICES=(
  risk-service
)

echo "🐳 Building all service images locally..."
echo "🔖 Using tag: $TAG"
echo ""

for svc in "${SERVICES[@]}"; do
  echo "----------------------------------------"
  echo "📦 Building $svc"
  docker build -t $svc:$TAG -t $svc:latest -f services/$svc/Dockerfile .
done

echo ""
echo "✅ All images built locally with tag: $TAG"

