#!/bin/bash

# -----------------------------------------
# GlobalQuantX Unified Multi-Service Builder
# -----------------------------------------

set -e

# Define all services and their Dockerfiles + registry paths
declare -A SERVICES=(
  ["api-gateway"]="Dockerfile.api-gateway europe-west2-docker.pkg.dev/globalquantx-prod/api/api-gateway"
  ["auth-service"]="Dockerfile.auth-service europe-west2-docker.pkg.dev/globalquantx-prod/auth/auth-service"
  ["user-service"]="Dockerfile.user-service europe-west2-docker.pkg.dev/globalquantx-prod/user/user-service"
  ["onboarding-service"]="Dockerfile.onboarding-service europe-west2-docker.pkg.dev/globalquantx-prod/onboarding/onboarding-service"
  ["kyc-service"]="Dockerfile.kyc-service europe-west2-docker.pkg.dev/globalquantx-prod/kyc/kyc-service"
  ["wallet-service"]="Dockerfile.wallet-service europe-west2-docker.pkg.dev/globalquantx-prod/wallet/wallet-service"

  ["trading-service"]="Dockerfile.trading-service europe-west2-docker.pkg.dev/globalquantx-prod/trading/trading-service"
  ["market-data-service"]="Dockerfile.market-data-service europe-west2-docker.pkg.dev/globalquantx-prod/market-data/market-data-service"
  ["risk-service"]="Dockerfile.risk-service europe-west2-docker.pkg.dev/globalquantx-prod/risk/risk-service"

  ["aml-monitoring-service"]="Dockerfile.aml-monitoring-service europe-west2-docker.pkg.dev/globalquantx-prod/aml/aml-monitoring-service"
  ["ledger-service"]="Dockerfile.ledger-service europe-west2-docker.pkg.dev/globalquantx-prod/ledger/ledger-service"
  ["reconciliation-service"]="Dockerfile.reconciliation-service europe-west2-docker.pkg.dev/globalquantx-prod/reconciliation/reconciliation-service"
)

# Version tag (you can override with: ./build-all.sh v0.0.13)
VERSION=${1:-"v0.0.1"}

echo "-----------------------------------------"
echo " Building all GlobalQuantX services"
echo " Version: $VERSION"
echo "-----------------------------------------"

for SERVICE in "${!SERVICES[@]}"; do
  ENTRY=(${SERVICES[$SERVICE]})
  DOCKERFILE=${ENTRY[0]}
  IMAGE=${ENTRY[1]}

  echo ""
  echo "🚀 Building $SERVICE"
  echo "    Dockerfile: $DOCKERFILE"
  echo "    Image: $IMAGE:$VERSION"

  docker buildx build \
    -f $DOCKERFILE \
    --platform linux/amd64,linux/arm64 \
    -t $IMAGE:$VERSION \
    --push .
done

echo ""
echo "✅ All services built and pushed successfully!"
echo "-----------------------------------------"

