#!/bin/bash
set -e

NAMESPACE="trading-platform"

SERVICES=(
  auth-service
  aml-monitoring-service
  api-gateway
  intelligence-service
  kyc-service
  ledger-service
  market-data-service
  onboarding-service
  reconciliation-service
  risk-service
  trading-service
  user-service
  wallet-service
)

echo "🚀 Deploying all services into namespace: $NAMESPACE"
echo ""

for svc in "${SERVICES[@]}"; do
  echo "----------------------------------------"
  echo "📦 Deploying $svc"

  DEPLOY="$svc/deployment.yaml"
  SERVICE="$svc/service.yaml"

  if [ -f "$DEPLOY" ]; then
    echo "  ➤ Applying deployment.yaml"
    kubectl apply -n $NAMESPACE -f "$DEPLOY"
  else
    echo "  ⚠️  No deployment.yaml found for $svc"
  fi

  if [ -f "$SERVICE" ]; then
    echo "  ➤ Applying service.yaml"
    kubectl apply -n $NAMESPACE -f "$SERVICE"
  else
    echo "  ⚠️  No service.yaml found for $svc"
  fi

  # Restart only if deployment exists
  if kubectl get deployment "$svc" -n "$NAMESPACE" >/dev/null 2>&1; then
    echo "  🔄 Restarting deployment/$svc"
    kubectl rollout restart deployment/$svc -n $NAMESPACE
  else
    echo "  ⚠️  Deployment $svc not found, skipping restart"
  fi

done

echo ""
echo "🎉 All service deployments applied and restarted"
echo ""
kubectl get pods -n $NAMESPACE

