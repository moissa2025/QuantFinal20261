import { Line } from "react-chartjs-2";

export default function WalletBalanceChart({ history }) {
  const data = {
    labels: history.map(h => new Date(h.created_at).toLocaleDateString()),
    datasets: [
      {
        label: "Wallet Balance",
        data: history.map(h => h.balance_after),
        borderColor: "#d97706",
        backgroundColor: "rgba(217,119,6,0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Balance Over Time</h2>
      <Line data={data} />
    </div>
  );
}

