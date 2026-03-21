#!/bin/bash
set -euo pipefail

PROJECT="globalquantx-prod"
LOCATION="europe-west2"

REPOS=(
  api
  auth
  user
  onboarding
  kyc
  wallet
  trading
  market-data
  risk
  aml
  ledger
  reconciliation
)

echo "---------------------------------------------"
echo " Creating Artifact Registry repositories"
echo " Project:   $PROJECT"
echo " Location:  $LOCATION"
echo "---------------------------------------------"
echo ""

for REPO in "${REPOS[@]}"; do
  echo "➡️  Creating repository: $REPO"

  gcloud artifacts repositories create "$REPO" \
    --repository-format=docker \
    --location="$LOCATION" \
    --project="$PROJECT" \
    --quiet || echo "   ⚠️  Repo '$REPO' already exists — skipping."

  echo "   ✔ Done: $REPO"
  echo ""
done

echo "---------------------------------------------"
echo "🎉 All repositories created (or already existed)"
echo "---------------------------------------------"

