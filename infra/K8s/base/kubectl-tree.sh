#!/bin/bash

NAMESPACE="trading-platform"

echo "🌳 Kubernetes Resource Tree — $NAMESPACE"
echo "===================================================="

kubectl get deploy,svc,pods -n $NAMESPACE -o wide --show-labels
echo
echo "🔗 Mapping Services → Deployments → Pods"
echo "----------------------------------------------------"

for svc in $(kubectl get svc -n $NAMESPACE -o jsonpath='{.items[*].metadata.name}'); do
  selector=$(kubectl get svc $svc -n $NAMESPACE -o jsonpath='{.spec.selector.app}')
  echo "🟦 Service: $svc"
  echo "   ↳ Deployment: $selector"
  pods=$(kubectl get pods -n $NAMESPACE -l app=$selector -o jsonpath='{.items[*].metadata.name}')
  for p in $pods; do
    echo "      ↳ Pod: $p"
  done
  echo
done

