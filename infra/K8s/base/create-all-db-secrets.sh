#!/usr/bin/env bash
set -euo pipefail
# PURPOSE: Creates all DB secrets for all microservices.
# WARNING: Does NOT touch Artifact Registry.



if [ -z "${DB_URL:-}" ]; then
  echo "❌ ERROR: DB_URL environment variable is not set."
  echo "Please run: export DB_URL=\"postgresql://...\""
  exit 1
fi

echo "🔐 Creating all DB secrets with DATABASE_URL + CA certificate..."
echo ""

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

