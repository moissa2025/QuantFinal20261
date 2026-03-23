#!/usr/bin/env bash

# -----------------------------------------
# GlobalQuantX Unified Multi-Service Builder
# -----------------------------------------

set -e

# Define all services and their registry paths
declare -A SERVICES=(
  ["api-gateway"]="europe-west2-docker.pkg.dev/globalquantx-prod/api/api-gateway"
  ["auth-service"]="europe-west2-docker.pkg.dev/globalquantx-prod/auth/auth-service"
  ["user-service"]="europe-west2-docker.pkg.dev/globalquantx-prod/user/user-service"
  ["onboarding-service"]="europe-west2-docker.pkg.dev/globalquantx-prod/onboarding/onboarding-service"
  ["kyc-service"]="europe-west2-docker.pkg.dev/globalquantx-prod/kyc/kyc-service"
  ["wallet-service"]="europe-west2-docker.pkg.dev/globalquantx-prod/wallet/wallet-service"

  ["trading-service"]="europe-west2-docker.pkg.dev/globalquantx-prod/trading/trading-service"
  ["market-data-service"]="europe-west2-docker.pkg.dev/globalquantx-prod/market-data/market-data-service"
  ["risk-service"]="europe-west2-docker.pkg.dev/globalquantx-prod/risk/risk-service"

  ["aml-monitoring-service"]="europe-west2-docker.pkg.dev/globalquantx-prod/aml/aml-monitoring-service"
  ["ledger-service"]="europe-west2-docker.pkg.dev/globalquantx-prod/ledger/ledger-service"
  ["reconciliation-service"]="europe-west2-docker.pkg.dev/globalquantx-prod/reconciliation/reconciliation-service"
)

# Version tag (override with: ./build-all.sh v0.0.13)
VERSION=${1:-"v0.0.1"}

echo "-----------------------------------------"
echo " Building all GlobalQuantX services"
echo " Version: $VERSION"
echo "-----------------------------------------"

for SERVICE in "${!SERVICES[@]}"; do
  IMAGE=${SERVICES[$SERVICE]}
  SERVICE_FOLDER="services/$SERVICE"
  DOCKERFILE="$SERVICE_FOLDER/Dockerfile"

  echo ""
  echo "🚀 Building $SERVICE"
  echo "    Folder: $SERVICE_FOLDER"
  echo "    Dockerfile: $DOCKERFILE"
  echo "    Image: $IMAGE:$VERSION"
docker buildx build \
  -f services/$SERVICE/Dockerfile \
  --platform linux/amd64,linux/arm64 \
  -t $IMAGE:$VERSION \
  --cache-from=type=registry,ref=$IMAGE:cache \
  --cache-to=type=registry,ref=$IMAGE:cache,mode=max \
  --push \
  .
done

echo ""
echo "✅ All services built and pushed successfully!"
echo "-----------------------------------------"

