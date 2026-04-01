import { useEffect, useState } from "react";
import { createWalletAccount, getWalletBalance } from "../api/wallet";

export function useWallet(userId: string) {
  const [account, setAccount] = useState<any>(null);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    async function init() {
      const acc = await createWalletAccount("USD");
      setAccount(acc);
      const bal = await getWalletBalance(acc.id);
      setBalance(bal.balance);
    }
    init();
  }, [userId]);

  return { account, balance };
}

