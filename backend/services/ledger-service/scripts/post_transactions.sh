#!/usr/bin/env bash
set -euo pipefail

BASE_URL="http://localhost:8000"

ASSET_ACCOUNT="18c25db4-1d68-42ce-9c2c-e70612d2e7da"
LIABILITY_ACCOUNT="e7130fbf-ae21-47d7-b126-864f8fb8b720"

post_tx() {
  local TYPE=$1
  local CORR=$2
  local AMOUNT=$3

  # Compute negative amount safely
  local NEG_AMOUNT
  NEG_AMOUNT=$(echo "$AMOUNT * -1" | bc)

  curl -s -X POST "$BASE_URL/transactions/" \
    -H "Content-Type: application/json" \
    -d "{
      \"type\": \"$TYPE\",
      \"correlation_id\": \"$CORR\",
      \"entries\": [
        { \"account_id\": \"$ASSET_ACCOUNT\", \"amount\": $AMOUNT },
        { \"account_id\": \"$LIABILITY_ACCOUNT\", \"amount\": $NEG_AMOUNT }
      ]
    }" | jq .
}

echo "Posting transactions..."

post_tx "deposit"    "corr-001" 100.00
post_tx "deposit"    "corr-002" 50.00
post_tx "withdrawal" "corr-003" -30.00
post_tx "deposit"    "corr-004" 200.00
post_tx "withdrawal" "corr-005" -20.00

echo "Done."

