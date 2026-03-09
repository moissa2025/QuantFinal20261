# From k8s/base
kubectl apply -f namespace/namespace.yaml
kubectl apply -f nats/
kubectl apply -f aml-monitoring-service/
kubectl apply -f api-gateway/
kubectl apply -f auth-service/
kubectl apply -f kyc-service/
kubectl apply -f ledger-service/
kubectl apply -f market-data-service/
kubectl apply -f onboarding-service/
kubectl apply -f reconciliation-service/
kubectl apply -f risk-service/
kubectl apply -f trading-service/
kubectl apply -f user-service/
kubectl apply -f wallet-service/

