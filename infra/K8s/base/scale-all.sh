#!/bin/bash

NAMESPACE="trading-platform"

if [ -z "$1" ]; then
  echo "Usage: ./scale-all.sh <replicas>"
  exit 1
fi

REPLICAS=$1

echo "📈 Scaling all deployments in $NAMESPACE to $REPLICAS replicas"
echo "=============================================================="

kubectl scale deployment --all -n $NAMESPACE --replicas=$REPLICAS

echo "⏳ Waiting for scaling to complete..."
kubectl wait --for=condition=available deployment --all -n $NAMESPACE --timeout=180s

echo "✅ Scaling complete."

