#!/bin/bash
set -e

NAMESPACE="trading-platform"

echo "🔥 Destroying full platform in namespace: $NAMESPACE"
echo "===================================================="

delete_deployment_and_service() {
  local name=$1
  echo "🗑️  Deleting deployment/$name..."
  kubectl delete deployment/$name -n $NAMESPACE --ignore-not-found=true

  echo "🗑️  Deleting service/$name..."
  kubectl delete service/$name -n $NAMESPACE --ignore-not-found=true
}

delete_statefulset_and_service() {
  local name=$1
  echo "🗑️  Deleting statefulset/$name..."
  kubectl delete statefulset/$name -n $NAMESPACE --ignore-not-found=true

  echo "🗑️  Deleting service/$name..."
  kubectl delete service/$name -n $NAMESPACE --ignore-not-found=true
}

echo "----------------------------------------------------"
echo "PHASE 6 — Trading & Gateway"
delete_deployment_and_service "api-gateway"
delete_deployment_and_service "trading-service"

echo "PHASE 5 — Market Data & Intelligence"
delete_deployment_and_service "risk-service"
delete_deployment_and_service "intelligence-service"
delete_deployment_and_service "market-data-service"

echo "PHASE 4 — Wallet & Ledger"
delete_deployment_and_service "reconciliation-service"
delete_deployment_and_service "ledger-service"
delete_deployment_and_service "wallet-service"

echo "PHASE 3 — KYC & Onboarding"
delete_deployment_and_service "onboarding-service"
delete_deployment_and_service "kyc-service"

echo "PHASE 2 — Identity & User Domain"
delete_deployment_and_service "user-service"
delete_deployment_and_service "auth-service"

echo "PHASE 1 — Infrastructure"
delete_deployment_and_service "nats"

echo "CockroachDB StatefulSet + Services"
delete_statefulset_and_service "cockroachdb"
kubectl delete service/cockroachdb-public -n $NAMESPACE --ignore-not-found=true

echo "----------------------------------------------------"
echo "🧹 Deleting ConfigMaps, Secrets"
kubectl delete configmap platform-config -n $NAMESPACE --ignore-not-found=true

echo "----------------------------------------------------"
echo "🎯 Platform teardown complete."

