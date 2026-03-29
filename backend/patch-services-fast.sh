#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="globalquantx-prod"
REGION="europe-west2"
TAG="v0.0.3"

PATCHED=(
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

docker buildx create --name gqx-builder --use --bootstrap || docker buildx use gqx-builder

for svc in "${PATCHED[@]}"; do
  IMAGE="gcr.io/${PROJECT_ID}/${svc}:${TAG}"
  echo ">>> Patching ${svc}"

  docker buildx build \
    --platform linux/amd64 \
    --cache-from=type=registry,ref="${IMAGE}-cache" \
    --cache-to=type=registry,ref="${IMAGE}-cache",mode=max \
    -f "services/${svc}/Dockerfile" \
    -t "${IMAGE}" \
    --push \
    "services/${svc}"

  echo ">>> Done: ${svc}"
done

echo "Patch complete."

