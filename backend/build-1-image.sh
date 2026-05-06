#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "❌ No tag provided."
  echo "Usage: ./build-1-image.sh v0.2.5"
  exit 1
fi

TAG=$1
SERVICE="auth-service"

echo "🐳 Building $SERVICE (no cache)..."
echo "🔖 Tag: $TAG"
echo ""

docker build \
  --no-cache \
  -t $SERVICE:$TAG \
  -t $SERVICE:latest \
  -f services/$SERVICE/Dockerfile \
  .

echo ""
echo "✅ Built $SERVICE:$TAG (no cache)"

