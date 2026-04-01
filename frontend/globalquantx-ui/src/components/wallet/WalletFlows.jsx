export default function WalletFlows({ transactions }) {
  const inflow = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const outflow = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const net = inflow - outflow;

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Inflow / Outflow</h2>

      <div className="grid grid-cols-3 text-center">
        <div>
          <p className="text-green-600 font-bold text-xl">+${inflow.toLocaleString()}</p>
          <p className="text-sm">Inflow</p>
        </div>

        <div>
          <p className="text-red-600 font-bold text-xl">-${outflow.toLocaleString()}</p>
          <p className="text-sm">Outflow</p>
        </div>

        <div>
          <p className="text-black font-bold text-xl">${net.toLocaleString()}</p>
          <p className="text-sm">Net</p>
        </div>
      </div>
    </div>
  );
}

