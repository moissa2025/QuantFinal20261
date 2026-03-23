#!/bin/bash
set -euo pipefail

#!/usr/bin/env bash

###############################################################################
# ⚠️  WARNING — ARTIFACT REGISTRY OPERATION (NOT DB SECRETS)
#
# This script ONLY creates Artifact Registry repositories.
# It does NOT create or modify Kubernetes secrets.
# It does NOT touch CockroachDB credentials.
#
# Running this script when you intended to rotate DB secrets is a critical error.
#
# If you intended to run: create-all-db-secrets.sh
# STOP NOW and exit this script immediately.
#
# To continue, you must type: CREATE-REPOS
###############################################################################

read -p "Type CREATE-REPOS to continue: " CONFIRM
if [[ "$CONFIRM" != "CREATE-REPOS" ]]; then
  echo "❌ Aborted — no repositories were created."
  exit 1
fi



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

