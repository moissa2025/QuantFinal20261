import { Doughnut } from "react-chartjs-2";

export default function WalletAllocationChart({ walletBalance, totalEquity }) {
  const data = {
    labels: ["Wallet", "Other Assets"],
    datasets: [
      {
        data: [walletBalance, totalEquity - walletBalance],
        backgroundColor: ["#d97706", "#e5e7eb"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Allocation Breakdown</h2>
      <Doughnut data={data} />
    </div>
  );
}

