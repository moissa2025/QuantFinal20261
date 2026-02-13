#!/bin/bash

URL="http://localhost:8000/ledger/system-accounts"

echo "Bootstrapping system accounts..."

create_account() {
  curl -s -X POST $URL \
    -H "Content-Type: application/json" \
    -d "$1"
  echo ""
}

# -------------------------
# ASSETS
# -------------------------
create_account '{"id":"ASSET_CASH","name":"Cash Reserves","type":"asset"}'
create_account '{"id":"ASSET_CRYPTO","name":"Crypto Reserves","type":"asset"}'
create_account '{"id":"ASSET_FEES_COLLECTED","name":"Fees Collected","type":"asset"}'
create_account '{"id":"ASSET_PENDING_SETTLEMENT","name":"Pending Settlement","type":"asset"}'

# -------------------------
# LIABILITIES
# -------------------------
create_account '{"id":"LIABILITY_USER_BALANCES","name":"User Balances","type":"liability"}'
create_account '{"id":"LIABILITY_EXCHANGE_OWES","name":"Exchange Owes","type":"liability"}'
create_account '{"id":"LIABILITY_PENDING_WITHDRAWALS","name":"Pending Withdrawals","type":"liability"}'
create_account '{"id":"LIABILITY_PENDING_DEPOSITS","name":"Pending Deposits","type":"liability"}'

# -------------------------
# REVENUE
# -------------------------
create_account '{"id":"REVENUE_TRADING_FEES","name":"Trading Fees","type":"revenue"}'
create_account '{"id":"REVENUE_WITHDRAWAL_FEES","name":"Withdrawal Fees","type":"revenue"}'

# -------------------------
# EXPENSES
# -------------------------
create_account '{"id":"EXPENSE_NETWORK_FEES","name":"Network Fees","type":"expense"}'
create_account '{"id":"EXPENSE_LIQUIDATION_LOSSES","name":"Liquidation Losses","type":"expense"}'

# -------------------------
# EQUITY
# -------------------------
create_account '{"id":"EQUITY_RETAINED_EARNINGS","name":"Retained Earnings","type":"equity"}'
create_account '{"id":"EQUITY_OPENING_BALANCES","name":"Opening Balances","type":"equity"}'

echo "System accounts bootstrapped successfully."

