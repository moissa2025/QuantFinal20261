#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="globalquantx-prod"
TAG="v0.0.3"

SERVICES=(
  "aml-monitoring-service"
  "auth-service"
  "ledger-service"
  "onboarding-service"
  "risk-service"
  "user-service"
  "kyc-service"
  "market-data-service"
  "reconciliation-service"
  "trading-service"
  "wallet-service"
)

# Ensure buildx builder exists
docker buildx create --name gqx-builder --use --bootstrap || docker buildx use gqx-builder

for svc in "${SERVICES[@]}"; do
  IMAGE="gcr.io/${PROJECT_ID}/${svc}:${TAG}"
  CACHE="gcr.io/${PROJECT_ID}/${svc}:${TAG}-cache"

  echo ""
  echo "──────────────────────────────────────────────"
  echo ">>> Building ${svc}"
  echo ">>> Image: ${IMAGE}"
  echo "──────────────────────────────────────────────"

  docker buildx build \
    --platform linux/amd64 \
    --cache-from=type=registry,ref="${CACHE}" \
    --cache-to=type=registry,ref="${CACHE}",mode=max \
    -f "services/${svc}/Dockerfile" \
    -t "${IMAGE}" \
    --push \
    .

  echo ">>> Done: ${svc}"
done

echo ""
echo "All patched services built and pushed successfully."

