import { Doughnut } from "react-chartjs-2";

export default function AllocationBreakdown({ wallet, positionsValue, cash, unrealizedPnL }) {
  const crypto = wallet?.crypto_balance_usd || 0;
  const fiat = wallet?.balance || 0;
  const total = positionsValue + cash + unrealizedPnL + crypto + fiat;

  const data = {
    labels: ["Crypto", "Fiat Wallet", "Positions", "Cash", "Unrealized PnL"],
    datasets: [
      {
        data: [crypto, fiat, positionsValue, cash, unrealizedPnL],
        backgroundColor: [
          "#f59e0b", // crypto
          "#10b981", // fiat
          "#3b82f6", // positions
          "#6366f1", // cash
          "#ef4444", // pnl
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Portfolio Allocation</h2>
      <Doughnut data={data} />
    </div>
  );
}

