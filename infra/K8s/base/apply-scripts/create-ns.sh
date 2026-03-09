# AML
kubectl create secret generic aml-db-secret \
  -n trading-platform \
  --from-literal=username=amluser \
  --from-literal=password=amlGos608eg \
  --from-literal=database=aml_db

# API Gateway
kubectl create secret generic apigw-db-secret \
  -n trading-platform \
  --from-literal=username=apiuser \
  --from-literal=password=apiGos608eg \
  --from-literal=database=apigw_db

# Auth
kubectl create secret generic auth-db-secret \
  -n trading-platform \
  --from-literal=username=authuser \
  --from-literal=password=Gos608eg \
  --from-literal=database=auth_db

# KYC
kubectl create secret generic kyc-db-secret \
  -n trading-platform \
  --from-literal=username=kycuser \
  --from-literal=password=kycGos608eg \
  --from-literal=database=kyc_db

# Ledger
kubectl create secret generic ledger-db-secret \
  -n trading-platform \
  --from-literal=username=ledgeruser \
  --from-literal=password=ledgerGos608eg \
  --from-literal=database=ledger_db

# Reconciliation
kubectl create secret generic reconcile-db-secret \
  -n trading-platform \
  --from-literal=username=reconcileuser \
  --from-literal=password=reconcileGos608eg \
  --from-literal=database=reconcile_db

# Onboarding
kubectl create secret generic onboard-db-secret \
  -n trading-platform \
  --from-literal=username=onboarduser \
  --from-literal=password=onboardGos608eg \
  --from-literal=database=onboard_db

# Risk
kubectl create secret generic risk-db-secret \
  -n trading-platform \
  --from-literal=username=riskuser \
  --from-literal=password=riskGos608eg \
  --from-literal=database=risk_db

# Trading
kubectl create secret generic trade-db-secret \
  -n trading-platform \
  --from-literal=username=tradeuser \
  --from-literal=password=tradeGos608eg \
  --from-literal=database=trade_db

# User
kubectl create secret generic user-db-secret \
  -n trading-platform \
  --from-literal=username=useruser \
  --from-literal=password=userGos608eg \
  --from-literal=database=user_db

# Wallet
kubectl create secret generic wallet-db-secret \
  -n trading-platform \
  --from-literal=username=walletuser \
  --from-literal=password=walletGos608eg \
  --from-literal=database=wallet_db

