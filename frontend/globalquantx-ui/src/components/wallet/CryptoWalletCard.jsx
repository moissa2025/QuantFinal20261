import QRCode from "react-qr-code";

export default function CryptoWalletCard({ account }) {
  return (
    <div className="rounded-2xl p-8 bg-black text-white shadow-xl">
      <h1 className="text-2xl font-bold">Crypto Wallet</h1>

      <div className="mt-6">
        <h2 className="font-semibold">BTC Address</h2>
        <p className="text-yellow-400 break-all">{account.btc_address}</p>
        <QRCode value={account.btc_address} className="mt-3" />
      </div>

      <div className="mt-6">
        <h2 className="font-semibold">ETH Address</h2>
        <p className="text-yellow-400 break-all">{account.eth_address}</p>
        <QRCode value={account.eth_address} className="mt-3" />
      </div>

      <div className="mt-6">
        <h2 className="font-semibold">Crypto Balance (USD)</h2>
        <p className="text-4xl font-extrabold">
          ${Number(account.crypto_balance_usd).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

