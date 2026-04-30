i#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "❌ No tag provided."
  echo "Usage: ./build-1-image.sh v0.2.5"
  exit 1
fi

TAG=$1
SERVICE="intelligence-service"

echo "🐳 Building $SERVICE..."
echo "🔖 Tag: $TAG"
echo ""

# IMPORTANT: build context must be backend root (.)
docker build \
  -t $SERVICE:$TAG \
  -t $SERVICE:latest \
  -f services/$SERVICE/Dockerfile \
  .

echo ""
echo "✅ Built $SERVICE:$TAG"

