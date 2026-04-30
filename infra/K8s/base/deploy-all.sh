#!/usr/bin/env bash
set -e

NAMESPACE="trading-platform"

echo "🚀 Applying all deployment.yaml and service.yaml files in namespace: $NAMESPACE"
echo "--------------------------------------------------------------------------"

# Apply all deployment.yaml files
find . -type f -name "deployment.yaml" | while read -r FILE; do
  echo "📄 Applying $FILE"
  kubectl apply -f "$FILE" -n "$NAMESPACE"
done

# Apply all service.yaml files
find . -type f -name "service.yaml" | while read -r FILE; do
  echo "📄 Applying $FILE"
  kubectl apply -f "$FILE" -n "$NAMESPACE"
done

echo "--------------------------------------------------------------------------"
echo "🔄 Restarting all deployments to pick up hardcoded image versions"

kubectl get deploy -n "$NAMESPACE" -o name | xargs kubectl rollout restart -n "$NAMESPACE"

echo "--------------------------------------------------------------------------"
echo "✅ All deployments and services applied and restarted successfully"

