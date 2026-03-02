#!/usr/bin/env bash

set -euo pipefail

NAMESPACE="trading"
RELEASE="trading-service"
CHART_PATH="./trading-service"

echo "🚀 Deploying $RELEASE to namespace $NAMESPACE"

# ---------------------------------------------------------
# 1. Ensure namespace exists
# ---------------------------------------------------------
if ! kubectl get namespace "$NAMESPACE" >/dev/null 2>&1; then
  echo "📦 Namespace $NAMESPACE does not exist. Creating..."
  kubectl create namespace "$NAMESPACE"
else
  echo "📦 Namespace $NAMESPACE already exists."
fi

# ---------------------------------------------------------
# 2. Apply secrets + configmap BEFORE Helm (optional but recommended)
# ---------------------------------------------------------
if [ -f "$CHART_PATH/templates/secret.yaml" ]; then
  echo "🔐 Applying secrets..."
  kubectl apply -f "$CHART_PATH/templates/secret.yaml" -n "$NAMESPACE"
fi

if [ -f "$CHART_PATH/templates/configmap.yaml" ]; then
  echo "⚙️  Applying configmap..."
  kubectl apply -f "$CHART_PATH/templates/configmap.yaml" -n "$NAMESPACE"
fi

# ---------------------------------------------------------
# 3. Validate Helm chart before installing
# ---------------------------------------------------------
echo "🔍 Validating Helm chart..."
helm lint "$CHART_PATH"

echo "🔍 Rendering templates for sanity check..."
helm template "$RELEASE" "$CHART_PATH" -n "$NAMESPACE" >/dev/null

# ---------------------------------------------------------
# 4. Install or upgrade Helm release
# ---------------------------------------------------------
echo "🚢 Installing/Upgrading Helm release..."
helm upgrade --install "$RELEASE" "$CHART_PATH" -n "$NAMESPACE"

# ---------------------------------------------------------
# 5. Show deployment + pod status
# ---------------------------------------------------------
echo "📡 Checking deployment status..."
kubectl rollout status deployment/"$RELEASE" -n "$NAMESPACE" || true

echo "🐳 Current pods:"
kubectl get pods -n "$NAMESPACE" -o wide

echo "✅ Deployment complete."

