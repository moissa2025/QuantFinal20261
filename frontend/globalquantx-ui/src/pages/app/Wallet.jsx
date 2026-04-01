import { useEffect, useState } from "react";
import { getWalletAccount } from "../../api/wwallet";
import WalletCard from "../../components/wallet/WalletCard";
import WalletTransactions from "../../components/wallet/WalletTransactions";
import "../../styles/wallet.css";
import { connectWalletSocket } from "../../api/walletSocket";

export default function Wallet() {
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Load initial wallet account
  useEffect(() => {
    getWalletAccount().then((res) => setAccount(res.data));
  }, []);
  useEffect(() => {
  const ws = connectWalletSocket((msg) => {
    if (msg.type === "wallet.balance.updated") {
      setAccount((prev) => ({ ...prev, balance: msg.balance }));
    }

    if (msg.type === "wallet.transaction.created") {
      setTransactions((prev) => [msg.tx, ...prev]);
    }
  });

  return () => ws.close();
}, []);

  return (
    <div className="wallet-page p-8 space-y-8">
      {account && <WalletCard account={account} />}
      {account && (
        <WalletTransactions
          accountId={account.id}
          transactions={transactions}
          setTransactions={setTransactions}
        />
      )}
    </div>
  );
}

