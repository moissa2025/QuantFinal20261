#!/bin/bash
set -e

NAMESPACE="trading-platform"

if [ -z "$1" ]; then
  echo "❌ No version tag provided."
  echo "Usage: ./deploy-platform.sh v0.0.1"
  exit 1
fi

VERSION="$1"

echo "🚀 Starting full platform rollout for namespace: $NAMESPACE (version: $VERSION)"
echo "=========================================================="

kubectl get namespace "$NAMESPACE" >/dev/null 2>&1 || {
  echo "📁 Namespace $NAMESPACE not found. Creating..."
  kubectl create namespace "$NAMESPACE"
}

wait_for_deploy() {
  local name=$1
  local ns=$2
  echo "⏳ Waiting for deployment/$name in namespace $ns to become ready..."
  kubectl rollout status deployment/"$name" -n "$ns" --timeout=180s
  echo "✅ $name in $ns is ready."
}

wait_for_statefulset() {
  local name=$1
  local ns=$2
  echo "⏳ Waiting for statefulset/$name in namespace $ns to become ready..."
  kubectl rollout status statefulset/"$name" -n "$ns" --timeout=300s
  echo "✅ $name in $ns is ready."
}

apply_and_wait() {
  local path=$1
  local name=$2

  echo "📦 Applying $name..."

  # Apply service.yaml first (if exists)
  if [ -f "$path/service.yaml" ]; then
    echo "📦 Applying $path/service.yaml"
    kubectl apply -f "$path/service.yaml"
  fi

  # Apply deployment.yaml (required)
  if [ -f "$path/deployment.yaml" ]; then
    echo "📦 Applying $path/deployment.yaml"
    kubectl apply -f "$path/deployment.yaml"
  else
    echo "❌ ERROR: $path/deployment.yaml not found!"
    exit 1
  fi

  wait_for_deploy "$name" "$NAMESPACE"
}

patch_image_version() {
  local svc=$1
  local path=$2
  echo "📝 Patching image tag for $svc in $path/deployment.yaml -> :$VERSION"

  # Normalize image line first
  sed -i.bak "s|image:.*${svc}.*|image: ${svc}:latest|" "$path/deployment.yaml"

  # Apply version safely
  sed -i.bak "s|image: ${svc}:.*|image: ${svc}:${VERSION}|" "$path/deployment.yaml"
}

echo "----------------------------------------------------------"
echo "PHASE 0 — Core Config"
echo "----------------------------------------------------------"
if [ -d "config" ]; then
  echo "📦 Applying config/..."
  kubectl apply -f config/
fi

echo "----------------------------------------------------------"
echo "PHASE 1 — Core Infrastructure (NATS, CockroachDB)"
echo "----------------------------------------------------------"

echo "📦 Applying NATS..."
kubectl apply -f nats/
wait_for_deploy "nats" "$NAMESPACE"

if [ -d "cockroachdb" ]; then
  echo "📦 Applying CockroachDB..."
  kubectl apply -f cockroachdb/
  wait_for_statefulset "cockroachdb" "$NAMESPACE"
fi

sleep 5

echo "----------------------------------------------------------"
echo "PHASE 2 — Identity & User Domain"
echo "----------------------------------------------------------"

patch_image_version "auth-service" "auth-service"
patch_image_version "user-service" "user-service"

apply_and_wait "auth-service/" "auth-service"
apply_and_wait "user-service/" "user-service"

sleep 5

echo "----------------------------------------------------------"
echo "PHASE 3 — KYC & Onboarding"
echo "----------------------------------------------------------"

patch_image_version "kyc-service" "kyc-service"
patch_image_version "onboarding-service" "onboarding-service"

apply_and_wait "kyc-service/" "kyc-service"
apply_and_wait "onboarding-service/" "onboarding-service"

sleep 5

echo "----------------------------------------------------------"
echo "PHASE 4 — Wallet & Ledger"
echo "----------------------------------------------------------"

patch_image_version "wallet-service" "wallet-service"
patch_image_version "ledger-service" "ledger-service"
patch_image_version "reconciliation-service" "reconciliation-service"

apply_and_wait "wallet-service/" "wallet-service"
apply_and_wait "ledger-service/" "ledger-service"
apply_and_wait "reconciliation-service/" "reconciliation-service"

sleep 5

echo "----------------------------------------------------------"
echo "PHASE 5 — Market Data & Intelligence"
echo "----------------------------------------------------------"

patch_image_version "market-data-service" "market-data-service"
patch_image_version "intelligence-service" "intelligence-service"
patch_image_version "risk-service" "risk-service"

apply_and_wait "market-data-service/" "market-data-service"
apply_and_wait "intelligence-service/" "intelligence-service"
apply_and_wait "risk-service/" "risk-service"

sleep 5

echo "----------------------------------------------------------"
echo "PHASE 6 — Trading & Gateway"
echo "----------------------------------------------------------"

patch_image_version "trading-service" "trading-service"
patch_image_version "api-gateway" "api-gateway"

apply_and_wait "trading-service/" "trading-service"
apply_and_wait "api-gateway/" "api-gateway"

echo "=========================================================="
echo "🎉 ALL SERVICES DEPLOYED SUCCESSFULLY (version: $VERSION)"
echo "=========================================================="

echo "🔄 Restarting all deployments to ensure env vars are picked up..."
kubectl rollout restart deployment -n "$NAMESPACE"

echo "🎯 Done."

