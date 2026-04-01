import React, { useEffect, useState } from "react";
import { getWalletAccount } from "../../api/wallet";
import WalletCard from "../../components/wallet/WalletCard";
import CryptoWalletCard from "../../components/wallet/CryptoWalletCard";
import WalletBalanceChart from "../../components/wallet/WalletBalanceChart";
import CryptoHistoryChart from "../../components/wallet/CryptoHistoryChart";
import WalletFlows from "../../components/wallet/WalletFlows";

export default function WalletDashboard() {
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getWalletAccount().then((res) => setWallet(res.data));
    // TODO: add getCryptoHistory() and setHistory
  }, []);

  if (!wallet) return null;

  return (
    <div className="page page-app page-wallet">
      <div className="page-header">
        <h1>Wallet</h1>
        <p>Fiat, crypto, and flows in one place.</p>
      </div>

      <div className="page-body grid gap-6 md:grid-cols-2">
        <WalletCard account={wallet} />
        <CryptoWalletCard account={wallet} />
      </div>

      <div className="page-body grid gap-6 md:grid-cols-2 mt-6">
        <WalletBalanceChart history={history} />
        <CryptoHistoryChart history={history} />
      </div>

      <div className="page-body mt-6">
        <WalletFlows transactions={[]} />
      </div>
    </div>
  );
}

