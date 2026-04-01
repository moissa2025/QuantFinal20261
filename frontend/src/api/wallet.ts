import api from "./client";

export async function createWalletAccount(currency = "USD") {
  const res = await api.post("/wallet/accounts", { currency });
  return res.data;
}

export async function getWalletBalance(accountId: string) {
  const res = await api.get(`/wallet/accounts/${accountId}`);
  return res.data;
}

export async function creditWallet(accountId: string, amount: number) {
  const res = await api.post(`/wallet/accounts/${accountId}/credit`, {
    amount,
    metadata: { source: "demo_deposit" }
  });
  return res.data;
}

