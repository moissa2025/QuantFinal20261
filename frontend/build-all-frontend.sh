#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="globalquantx-prod"
REGION="europe-west2"
REPO="frontend"
TAG="v0.0.1"

FRONTENDS=(
  "globalquantx-ui"
)

docker buildx create --name gqx-builder --use --bootstrap >/dev/null 2>&1 || docker buildx use gqx-builder

for fe in "${FRONTENDS[@]}"; do
  IMAGE="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/${fe}:${TAG}"
  echo ">>> Building ${fe} -> ${IMAGE}"

  docker buildx build \
    --platform linux/amd64 \
    -f "${fe}/Dockerfile" \
    -t "${IMAGE}" \
    --push \
    .
done

echo "🎉 All front-ends built and pushed."

