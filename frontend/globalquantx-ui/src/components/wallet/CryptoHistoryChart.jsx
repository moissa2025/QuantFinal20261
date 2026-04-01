import { Line } from "react-chartjs-2";

export default function CryptoHistoryChart({ history }) {
  const data = {
    labels: history.map(h => new Date(h.created_at).toLocaleDateString()),
    datasets: [
      {
        label: "Crypto USD Value",
        data: history.map(h => h.amount_usd),
        borderColor: "#f97316",
        backgroundColor: "rgba(249,115,22,0.2)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Crypto Value Over Time</h2>
      <Line data={data} />
    </div>
  );
}

