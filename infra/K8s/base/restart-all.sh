#!/bin/bash

NAMESPACE="trading-platform"

echo "🔄 Restarting all deployments in $NAMESPACE"
echo "=========================================="

kubectl rollout restart deployment -n $NAMESPACE

echo "⏳ Waiting for all deployments to become ready..."
kubectl wait --for=condition=available deployment --all -n $NAMESPACE --timeout=180s

echo "✅ All deployments restarted and ready."

