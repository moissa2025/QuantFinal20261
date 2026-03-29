# aml-monitoring-service
docker buildx build \
  --platform linux/amd64 \
  -f services/aml-monitoring-service/Dockerfile \
  -t gcr.io/globalquantx-prod/aml-monitoring-service:v0.0.2 \
  --push .

# auth-service
docker buildx build \
  --platform linux/amd64 \
  -f services/auth-service/Dockerfile \
  -t gcr.io/globalquantx-prod/auth-service:v0.0.2 \
  --push .

# ledger-service
docker buildx build \
  --platform linux/amd64 \
  -f services/ledger-service/Dockerfile \
  -t gcr.io/globalquantx-prod/ledger-service:v0.0.2 \
  --push .

# onboarding-service
docker buildx build \
  --platform linux/amd64 \
  -f services/onboarding-service/Dockerfile \
  -t gcr.io/globalquantx-prod/onboarding-service:v0.0.2 \
  --push .

# risk-service
docker buildx build \
  --platform linux/amd64 \
  -f services/risk-service/Dockerfile \
  -t gcr.io/globalquantx-prod/risk-service:v0.0.2 \
  --push .

# user-service
docker buildx build \
  --platform linux/amd64 \
  -f services/user-service/Dockerfile \
  -t gcr.io/globalquantx-prod/user-service:v0.0.2 \
  --push .

# kyc-service
docker buildx build \
  --platform linux/amd64 \
  -f services/kyc-service/Dockerfile \
  -t gcr.io/globalquantx-prod/kyc-service:v0.0.2 \
  --push .

# market-data-service
docker buildx build \
  --platform linux/amd64 \
  -f services/market-data-service/Dockerfile \
  -t gcr.io/globalquantx-prod/market-data-service:v0.0.2 \
  --push .

# reconciliation-service
docker buildx build \
  --platform linux/amd64 \
  -f services/reconciliation-service/Dockerfile \
  -t gcr.io/globalquantx-prod/reconciliation-service:v0.0.2 \
  --push .

# trading-service
docker buildx build \
  --platform linux/amd64 \
  -f services/trading-service/Dockerfile \
  -t gcr.io/globalquantx-prod/trading-service:v0.0.2 \
  --push .

# wallet-service
docker buildx build \
  --platform linux/amd64 \
  -f services/wallet-service/Dockerfile \
  -t gcr.io/globalquantx-prod/wallet-service:v0.0.2 \
  --push .

