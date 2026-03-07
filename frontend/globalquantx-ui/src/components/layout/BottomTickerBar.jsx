import { useEffect, useState } from "react";
import { connectMarketStream } from "../../api/marketStream";
import MarketTicker from "../markets/MarketTicker";

// --- STATIC ETF TICKERS ---
const etfs = [
  { symbol: "EEM", price: 41.32, changePct: -0.07 },
  { symbol: "XLK", price: 210.55, changePct: 0.03 },
  { symbol: "XLF", price: 39.12, changePct: -0.02 },
  { symbol: "XLV", price: 142.88, changePct: 0.22 },
  { symbol: "XLE", price: 89.21, changePct: 0.04 },
  { symbol: "HYG", price: 76.32, changePct: -0.11 },
  { symbol: "LQD", price: 108.45, changePct: 0.01 },
];

// --- STATIC FTSE100 ROTATION ---
const ftse100 = Array.from({ length: 100 }).map((_, i) => ({
  symbol: `FTSE${i + 1}`,
  price: (40 + Math.random() * 200).toFixed(2),
  changePct: (Math.random() * 2 - 1).toFixed(2),
}));

export default function BottomTickerBar() {
  const [tickers, setTickers] = useState({});
  const [ftseIndex, setFtseIndex] = useState(0);

  // --- LIVE MARKET STREAM ---
  useEffect(() => {
    const ws = connectMarketStream((msg) => {
      if (msg.type === "ticker") {
        setTickers((prev) => ({
          ...prev,
          [msg.symbol]: msg.price,
        }));
      }
    });

    return () => ws && ws.close();
  }, []);

  // --- ROTATE FTSE100 EVERY 5 SECONDS ---
  useEffect(() => {
    const id = setInterval(() => {
      setFtseIndex((i) => (i + 20) % 100);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const ftseBatch = ftse100.slice(ftseIndex, ftseIndex + 20);

  return (
    <div className="bottom-ticker-bar">
      <div className="ticker-strip">

        {/* LIVE MARKET TICKERS */}
        {Object.entries(tickers).map(([symbol, price]) => (
          <MarketTicker key={symbol} symbol={symbol} price={price} />
        ))}

        {/* STATIC ETF TICKERS */}
        {etfs.map((m) => (
          <div key={m.symbol} className="ticker-item">
            <span>{m.symbol}</span>
            <span>{m.price}</span>
            <span className={m.changePct >= 0 ? "up" : "down"}>
              {m.changePct}%
            </span>
          </div>
        ))}

        {/* ROTATING FTSE100 TICKERS */}
        {ftseBatch.map((m) => (
          <div key={m.symbol} className="ticker-item">
            <span>{m.symbol}</span>
            <span>{m.price}</span>
            <span className={m.changePct >= 0 ? "up" : "down"}>
              {m.changePct}%
            </span>
          </div>
        ))}

      </div>
    </div>
  );
}

