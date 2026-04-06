#!/bin/bash

svc="market-data-service"
IMAGE="europe-west2-docker.pkg.dev/globalquantx-prod/api/${svc}:v0.0.2"

echo "🚀 Building multi-arch image for ${svc}"
echo "📦 Output image: ${IMAGE}"
echo ""

docker buildx build \
    --platform linux/arm64,linux/amd64 \
    -f "backend/services/${svc}/Dockerfile" \
    -t "${IMAGE}" \
    --push \
    .

echo ""
echo "✅ Build + push complete for ${svc}"
echo "🔖 Image tag: v0.0.2"

