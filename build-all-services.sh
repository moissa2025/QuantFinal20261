#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="globalquantx-prod"
REGION="europe-west2"
REPO="api"
TAG="v0.0.1"

SERVICES=(
  "api-gateway"
  "auth-service"
  "kyc-service"
  "ledger-service"
  "market-data-service"
  "onboarding-service"
  "reconciliation-service"
  "risk-service"
  "trading-service"
  "user-service"
  "wallet-service"
  "aml-monitoring-service"
)

# Create and use a buildx builder (idempotent)
docker buildx create --name gqx-builder --use --bootstrap 2>/dev/null || \
docker buildx use gqx-builder

echo ">>> Using builder: gqx-builder"
echo ">>> Building multi-arch images: linux/arm64 + linux/amd64"

for svc in "${SERVICES[@]}"; do
  IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${svc}:${TAG}"
  echo ">>> Building ${svc} -> ${IMAGE}"

  docker buildx build \
    --platform linux/arm64,linux/amd64 \
    -f "backend/services/${svc}/Dockerfile" \
    -t "${IMAGE}" \
    --push \
    .

  echo ">>> Done: ${svc}"
done

echo "All services built and pushed for linux/arm64 + linux/amd64."

