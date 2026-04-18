#!/bin/bash
set -e

# Validate tag argument
if [ -z "$1" ]; then
  echo "❌ No tag provided."
  echo "Usage: ./load-all-images.sh v0.0.1"
  exit 1
fi

TAG=$1

SERVICES=(
  wallet-service
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

