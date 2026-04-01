export default function WalletTransactions({ transactions }) {
  if (!transactions.length) {
    return (
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <p className="text-gray-500">No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex justify-between border-b pb-2 text-sm"
          >
            <span>{tx.tx_type}</span>
            <span
              className={
                tx.amount > 0 ? "text-green-600" : "text-red-600"
              }
            >
              {tx.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

