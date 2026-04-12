#!/bin/bash

NAMESPACE="trading-platform"

echo "❤️  Auto-Heal — Restarting failing pods"
echo "======================================="

pods=$(kubectl get pods -n $NAMESPACE | grep -E "CrashLoopBackOff|Error" | awk '{print $1}')

if [ -z "$pods" ]; then
  echo "✅ No failing pods detected."
  exit 0
fi

for pod in $pods; do
  echo "🔄 Restarting $pod..."
  kubectl delete pod $pod -n $NAMESPACE
done

echo "⏳ Waiting for pods to recover..."
sleep 5

kubectl get pods -n $NAMESPACE

echo "✅ Auto-heal complete."

