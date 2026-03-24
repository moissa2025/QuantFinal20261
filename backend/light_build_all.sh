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
)

echo ">>> Initializing buildx builder (cached, multi-service)…"
docker buildx create --name gqx-builder --use --bootstrap >/dev/null 2>&1 || docker buildx use gqx-builder

echo ">>> Starting builds for linux/amd64…"

for svc in "${SERVICES[@]}"; do
  IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${svc}:${TAG}"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ">>> Building ${svc}"
  echo ">>> Target: ${IMAGE}"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  docker buildx build \
    --platform linux/amd64 \
    -f "services/${svc}/Dockerfile" \
    -t "${IMAGE}" \
    --push \
    .

  echo ">>> Completed: ${svc}"
done

echo ""
echo "🎉 All services built and pushed successfully (linux/amd64)."

