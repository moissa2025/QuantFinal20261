// src/components/portfolio/AllocationBreakdown.jsx
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

// ⭐ REQUIRED — fixes Vite import error
ChartJS.register(ArcElement, Tooltip, Legend);

export default function AllocationBreakdown({
  wallet,
  positionsValue,
  cash,
  unrealizedPnL
}) {
  const crypto = wallet?.crypto_balance_usd || 0;
  const fiat = wallet?.balance || 0;
  const total = positionsValue + cash + unrealizedPnL + crypto + fiat;

  const data = {
    labels: ["Crypto", "Fiat Wallet", "Positions", "Cash", "Unrealized PnL"],
    datasets: [
      {
        data: [crypto, fiat, positionsValue, cash, unrealizedPnL],
        backgroundColor: [
          "#f59e0b",
          "#10b981",
          "#3b82f6",
          "#6366f1",
          "#ef4444",
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

