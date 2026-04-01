import { useState } from "react";
import { creditWallet } from "../../api/wallet";

export default function WalletDeposit({ account }) {
  const [amount, setAmount] = useState("");

  async function submit() {
    await creditWallet(account.id, Number(amount));
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Deposit Funds</h2>

      <div className="flex items-center gap-2">
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
        Deposit
      </button>
    </div>
  );
}

