#!/bin/bash

echo "🔄 Restarting IDENTITY domain..."
kubectl rollout restart deployment auth-service -n trading-platform
kubectl rollout restart deployment api-gateway -n trading-platform
kubectl rollout restart deployment user-service -n trading-platform
kubectl rollout restart deployment onboarding-service -n trading-platform

echo "🔄 Restarting TRADE domain..."
kubectl rollout restart deployment trading-service -n trade-platform
kubectl rollout restart deployment risk-service -n trade-platform
kubectl rollout restart deployment ledger-service -n trade-platform
kubectl rollout restart deployment wallet-service -n trade-platform

echo "🔄 Restarting COMPLIANCE domain..."
kubectl rollout restart deployment kyc-service -n compliance-platform
kubectl rollout restart deployment aml-monitoring-service -n compliance-platform
kubectl rollout restart deployment intelligence-service -n compliance-platform
kubectl rollout restart deployment reconciliation-service -n compliance-platform
kubectl rollout restart deployment market-data-service -n compliance-platform

echo "✅ All services restarted."

