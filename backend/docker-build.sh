docker build --platform=linux/amd64 \
  -t gcr.io/correcttradingplatform/aml-monitoring-service:latest \
  -f services/aml-monitoring-service/Dockerfile .


docker build --platform=linux/amd64 \
  -t gcr.io/correcttradingplatform/api-gateway:latest \
  -f services/api-gateway/Dockerfile .


docker build --platform=linux/amd64 \
  -t gcr.io/correcttradingplatform/wallet-service:latest \
  -f services/wallet-service/Dockerfile .

docker build --platform=linux/amd64 \
  -t gcr.io/correcttradingplatform/auth-service:latest \
  -f services/auth-service/Dockerfile .


docker build --platform=linux/amd64 \
  -t gcr.io/correcttradingplatform/kyc-service:latest \
  -f services/kyc-service/Dockerfile .


docker build --platform=linux/amd64 \
  -t gcr.io/correcttradingplatform/ledger-service:latest \
  -f services/ledger-service/Dockerfile .



docker build --platform=linux/amd64 \
  -t gcr.io/correcttradingplatform/wallet-service:latest \
  -f services/wallet-service/Dockerfile .


docker build --platform=linux/amd64 \
  -t gcr.io/correcttradingplatform/market-data-service:latest \
  -f services/market-data-service/Dockerfile .


docker build --platform=linux/amd64 \
  -t gcr.io/correcttradingplatform/onboarding-service:latest \
  -f services/onboarding-service/Dockerfile .


docker build --platform=linux/amd64 \
  -t gcr.io/correcttradingplatform/reconciliation-service:latest \
  -f services/reconciliation-service/Dockerfile .


docker build --platform=linux/amd64 \
  -t gcr.io/correcttradingplatform/risk-service:latest \
  -f services/risk-service/Dockerfile .


docker build --platform=linux/amd64 \
  -t gcr.io/correcttradingplatform/trading-service:latest \
  -f services/trading-service/Dockerfile .

docker build --platform=linux/amd64 \
  -t gcr.io/correcttradingplatform/user-service:latest \
  -f services/user-service/Dockerfile .

docker build --platform=linux/amd64 \
  -t gcr.io/correcttradingplatform/wallet-service:latest \
  -f services/wallet-service/Dockerfile .
