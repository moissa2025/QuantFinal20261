kubectl rollout restart deployment aml-monitoring-service -n compliance-platform
kubectl rollout restart deployment intelligence-service -n compliance-platform
kubectl rollout restart deployment kyc-service -n compliance-platform
kubectl rollout restart deployment reconciliation-service -n compliance-platform

