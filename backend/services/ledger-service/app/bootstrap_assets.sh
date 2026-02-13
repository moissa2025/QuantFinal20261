#!/bin/bash

URL="http://localhost:8000/ledger/assets/bulk"

echo "Loading assets into ledger-service..."

curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  --data-binary "@assets.json"

echo ""
echo "Done."

