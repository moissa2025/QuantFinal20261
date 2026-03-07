import { apiClient } from "./client";

export function getBalances() {
  return apiClient("/ledger/balances");
}

export function getTransactions() {
  return apiClient("/ledger/transactions");
}

