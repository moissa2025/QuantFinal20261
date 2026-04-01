export default function SubaccountsList({ subaccounts }) {
  if (!subaccounts.length) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Sub‑accounts</h2>
      <div className="space-y-2">
        {subaccounts.map((s) => (
          <div key={s.id} className="flex justify-between text-sm">
            <span>{s.name} ({s.type})</span>
            <span>
              {s.currency} {Number(s.balance).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

