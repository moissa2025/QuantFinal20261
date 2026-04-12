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
    echo "  🔍 Ensuring envFrom exists in $DEPLOY"

    # Insert envFrom if missing (idempotent)
    if ! grep -q "envFrom:" "$DEPLOY"; then
      echo "  ➕ Adding envFrom to $DEPLOY"
      yq -i '.spec.template.spec.containers[0].envFrom += [{"configMapRef": {"name": "platform-config"}}]' "$DEPLOY"
    else
      echo "  ✔ envFrom already present"
    fi

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

  echo "  🔄 Restarting deployment"
  kubectl rollout restart deployment/$svc -n $NAMESPACE || true

done

echo ""
echo "🎉 All service deployments applied and restarted"
echo ""
kubectl get pods -n $NAMESPACE

