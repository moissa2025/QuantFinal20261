import { useState } from "react";
import WalletModal from "./WalletModal";
import WalletDeposit from "./WalletDeposit";
import WalletTransfer from "./WalletTransfer";

export default function WalletCard({ account }) {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);

  return (
    <div className="wallet-card rounded-2xl p-8 bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-xl">
      <h1 className="text-2xl font-bold">Wallet Balance</h1>

      <p className="text-5xl font-extrabold mt-4">
        {account.currency} {Number(account.balance).toLocaleString()}
      </p>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setShowDeposit(true)}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Deposit
        </button>

        <button
          onClick={() => setShowTransfer(true)}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Transfer
        </button>
      </div>

      <WalletModal open={showDeposit} onClose={() => setShowDeposit(false)}>
        <WalletDeposit account={account} />
      </WalletModal>

      <WalletModal open={showTransfer} onClose={() => setShowTransfer(false)}>
        <WalletTransfer account={account} />
      </WalletModal>
    </div>
  );
}

