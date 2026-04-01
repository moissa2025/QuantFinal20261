import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { creditWallet } from "../api/wallet";

export default function WalletPage({ user }) {
  const { account, balance } = useWallet(user.id);
  const [amount, setAmount] = useState("");

  if (!account) return <div>Loading wallet...</div>;

  async function deposit() {
    await creditWallet(account.id, parseFloat(amount));
    window.location.reload();
  }

  return (
    <div>
      <h1>Wallet</h1>
      <p>Account ID: {account.id}</p>
      <p>Balance: {balance}</p>

      <h3>Deposit</h3>
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={deposit}>Deposit</button>
    </div>
  );
}

