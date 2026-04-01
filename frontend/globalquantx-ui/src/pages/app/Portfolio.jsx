import React, { useEffect, useState } from "react";
import { getWalletAccount } from "../../api/wallet";
import { connectWalletSocket } from "../../api/walletSocket";
import AllocationBreakdown from "../../components/portfolio/AllocationBreakdown";

export default function Portfolio() {
  const [wallet, setWallet] = useState(null);

  //
  // 1. Load wallet on page load
  //
  useEffect(() => {
    getWalletAccount().then((res) => setWallet(res.data));
  }, []);

  //
  // 2. Real‑time wallet updates via WebSocket
  //
  useEffect(() => {
    const ws = connectWalletSocket((msg) => {
      if (msg.type === "wallet.balance.updated") {
        setWallet((prev) => ({ ...prev, balance: msg.balance }));
      }

      if (msg.type === "wallet.crypto.updated") {
        setWallet((prev) => ({
          ...prev,
          crypto_balance_usd: msg.crypto_balance_usd,
        }));
      }
    });

    return () => ws.close();
  }, []);

  //
  // 3. Portfolio calculations
  //
  const positionsValue = 0;     // replace with real values
  const cash = 0;               // replace with real values
  const unrealizedPnL = 0;      // replace with real values

  const totalEquity =
    positionsValue +
    cash +
    unrealizedPnL +
    (wallet?.balance || 0) +
    (wallet?.crypto_balance_usd || 0);

  return (
    <div className="page page-app page-portfolio">
      <div className="page-header">
        <h1>Portfolio</h1>
        <p>Holdings, exposures, and performance over time.</p>
      </div>

      <div className="page-body">
        <p>
          Review portfolio composition, exposures by asset class, and
          performance attribution.
        </p>

        <div className="portfolio-summary">
          <div className="portfolio-summary-item">
            <span>Total Equity</span>
            <span>${totalEquity.toLocaleString()}</span>
          </div>

          <div className="portfolio-summary-item">
            <span>Wallet Balance</span>
            <span>${Number(wallet?.balance || 0).toLocaleString()}</span>
          </div>

          <div className="portfolio-summary-item">
            <span>Crypto Balance (USD)</span>
            <span>
              ${Number(wallet?.crypto_balance_usd || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Allocation Breakdown */}
        <AllocationBreakdown
          wallet={wallet}
          positionsValue={positionsValue}
          cash={cash}
          unrealizedPnL={unrealizedPnL}
        />
      </div>
    </div>
  );
}

