import client from "./httpClient";

export function getWalletAccount() {
  return client.get("/wallet/accounts");
}

export function creditWallet(id, amount) {
  return client.post(`/wallet/accounts/${id}/credit`, { amount });
}

export function debitWallet(id, amount) {
  return client.post(`/wallet/accounts/${id}/debit`, { amount });
}

export function transferWallet(from, to, amount) {
  return client.post(`/wallet/transfer`, {
    from_account: from,
    to_account: to,
    amount,
  });
}

export function getTransactions(id) {
  return client.get(`/wallet/accounts/${id}/transactions`);
}

