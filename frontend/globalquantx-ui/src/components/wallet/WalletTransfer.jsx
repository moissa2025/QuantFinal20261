import { useState } from "react";
import { transferWallet } from "../../api/wallet";

export default function WalletTransfer({ account }) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  async function submit() {
    await transferWallet(account.id, to, Number(amount));
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Transfer Funds</h2>

      <input
        className="border p-2 rounded w-full"
        placeholder="Recipient Account ID"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <div className="flex items-center gap-2 mt-3">
        <input
          type="number"
          className="border p-2 rounded w-full"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <span className="text-gray-500">{account.currency}</span>
      </div>

      <button
        onClick={submit}
        className="w-full mt-4 bg-black text-white py-2 rounded-lg"
      >
        Transfer
      </button>
    </div>
  );
}

