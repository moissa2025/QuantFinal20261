#!/usr/bin/env bash
set -euo pipefail

echo "🔐 Creating all DB secrets with DATABASE_URL + CA certificate..."
echo ""

# Shared DATABASE_URL for all services
DB_URL="postgresql://mo:FUa7p0w1phYKChdQBCwehg@social-sardine-13508.jxf.gcp-europe-west2.cockroachlabs.cloud:26257/globalquantx?sslmode=verify-full"

# List of all DB secrets
SECRETS=(
  auth-db-url
  user-db-url
  wallet-db-url
  onboarding-db-url
  kyc-db-url
  market-data-db-url
  trading-db-url
  risk-db-url
  ledger-db-url
  reconciliation-db-url
  aml-db-url
  apigw-db-url
)

for SECRET in "${SECRETS[@]}"; do
  echo "➡️  Creating secret: $SECRET"

  kubectl create secret generic "$SECRET" \
    --from-literal=DATABASE_URL="$DB_URL" \
    --from-file=ca.crt=root.crt \
    -n trading-platform \
    --dry-run=client -o yaml | kubectl apply -f -

  echo "   ✔ Created $SECRET"
  echo ""
done

echo "🎉 All DB secrets created successfully!"

