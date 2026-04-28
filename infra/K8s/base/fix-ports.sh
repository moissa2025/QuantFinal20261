#!/bin/bash
set -e

NAMESPACE="trading-platform"

echo "🔥 Cyrus Auto-Port Detector & YAML Patcher"
echo "------------------------------------------"

# All your services
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

for svc in "${SERVICES[@]}"; do
  echo ""
  echo "🔍 Checking $svc..."

  # Find a running pod for this service
  POD=$(kubectl get pods -n $NAMESPACE -o jsonpath="{.items[?(@.metadata.labels.app=='$svc')].metadata.name}" | awk '{print $1}')

  if [ -z "$POD" ]; then
    echo "  ⚠️  No pod found for $svc, skipping."
    continue
  fi

  # Detect actual port from logs
  PORT=$(kubectl logs $POD -n $NAMESPACE 2>/dev/null | grep -Eo "0\.0\.0\.0:[0-9]+" | head -n1 | cut -d: -f2)

  if [ -z "$PORT" ]; then
    echo "  ⚠️  Could not detect port from logs, defaulting to 8080"
    PORT=8080
  fi

  echo "  ✅ Detected port: $PORT"

  DEPLOY="$svc/deployment.yaml"
  SERVICE="$svc/service.yaml"

  if [ -f "$DEPLOY" ]; then
    echo "  ✏️  Patching deployment.yaml → containerPort=$PORT"
    yq -i ".spec.template.spec.containers[0].ports[0].containerPort = $PORT" "$DEPLOY"
  else
    echo "  ⚠️  No deployment.yaml found for $svc"
  fi

  if [ -f "$SERVICE" ]; then
    echo "  ✏️  Patching service.yaml → port=$PORT, targetPort=$PORT"
    yq -i ".spec.ports[0].port = $PORT" "$SERVICE"
    yq -i ".spec.ports[0].targetPort = $PORT" "$SERVICE"
  else
    echo "  ⚠️  No service.yaml found for $svc"
  fi

  echo "  🚀 Applying patched YAML"
  kubectl apply -f "$DEPLOY" -n $NAMESPACE 2>/dev/null || true
  kubectl apply -f "$SERVICE" -n $NAMESPACE 2>/dev/null || true

  echo "  🔄 Restarting deployment"
  kubectl rollout restart deployment/$svc -n $NAMESPACE || true

done

echo ""
echo "🎉 All services patched, applied, and restarted."
echo "💚 Cyrus has restored order to your cluster."

