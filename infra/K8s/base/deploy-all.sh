#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Deploying GlobalQuantX Platform to GKE..."
echo ""

# Ensure namespace exists
kubectl apply -f namespace/namespace.yaml

echo "📡 Deploying NATS..."
kubectl apply -f nats/nats.yaml

echo ""
echo "🧩 Deploying CORE services..."
kubectl apply -f api-gateway/deployment.yaml
kubectl apply -f api-gateway/service.yaml

kubectl apply -f auth-service/deployment.yaml
kubectl apply -f auth-service/service.yaml

kubectl apply -f user-service/deployment.yaml
kubectl apply -f user-service/service.yaml

kubectl apply -f onboarding-service/deployment.yaml
kubectl apply -f onboarding-service/service.yaml

kubectl apply -f kyc-service/deployment.yaml
kubectl apply -f kyc-service/service.yaml

kubectl apply -f wallet-service/deployment.yaml
kubectl apply -f wallet-service/service.yaml

echo ""
echo "⚡ Deploying TRADING services..."
kubectl apply -f trading-service/deployment.yaml
kubectl apply -f trading-service/service.yaml

kubectl apply -f market-data-service/deployment.yaml
kubectl apply -f market-data-service/service.yaml

kubectl apply -f risk-service/deployment.yaml
kubectl apply -f risk-service/service.yaml

echo ""
echo "📊 Deploying BACKOFFICE services..."
kubectl apply -f aml-monitoring-service/deployment.yaml
kubectl apply -f aml-monitoring-service/service.yaml

kubectl apply -f ledger-service/deployment.yaml
kubectl apply -f ledger-service/service.yaml

kubectl apply -f reconciliation-service/deployment.yaml
kubectl apply -f reconciliation-service/service.yaml

echo ""
echo "⏳ Waiting for all pods to become Ready..."
kubectl wait --for=condition=Ready pods --all -n trading-platform --timeout=300s

echo ""
echo "🎉 All services deployed successfully!"

