#!/bin/bash
set -e

NAMESPACE="trading-platform"

echo "🚀 Deploying GlobalQuantX Platform"
echo "-----------------------------------------------------------"

apply_service() {
  SERVICE=$1
  echo "📦 Applying $SERVICE ..."

  # Apply only standard Kubernetes manifests
  for file in $SERVICE/*.yaml; do
    # Skip GKE-only CRDs
    if [[ "$file" == *"backendconfig"* ]] || [[ "$file" == *"managed-certificate"* ]]; then
      echo "⏭️  Skipping GKE-only file: $file"
      continue
    fi

    kubectl apply -n $NAMESPACE -f "$file"
  done

  echo "✅ $SERVICE applied"
  echo ""
}

echo "📁 Ensuring namespace exists..."
kubectl apply -f namespace/namespace.yaml
echo ""

echo "📦 Applying NATS (namespace-aware)..."
kubectl apply -f nats/
echo "✅ NATS applied"
echo ""

# Apply each microservice folder into trading-platform
apply_service "api-gateway"
apply_service "auth-service"
apply_service "user-service"
apply_service "wallet-service"
apply_service "onboarding-service"
apply_service "kyc-service"
apply_service "ledger-service"
apply_service "reconciliation-service"
apply_service "trading-service"
apply_service "market-data-service"
apply_service "risk-service"
apply_service "aml-monitoring-service"
apply_service "intelligence-service"

echo "-----------------------------------------------------------"
echo "🎉 All services applied successfully!"
echo "You may now run: kubectl rollout restart deploy -n $NAMESPACE"
echo "-----------------------------------------------------------"

