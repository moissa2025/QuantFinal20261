import React, { useEffect, useState } from "react";

const ftse100 = Array.from({ length: 100 }).map((_, i) => ({
  symbol: `FTSE${i + 1}`,
  price: (40 + Math.random() * 200).toFixed(2),
  changePct: (Math.random() * 2 - 1).toFixed(2),
}));

const ScrollingFtseTicker = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 20) % 100);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const batch = ftse100.slice(index, index + 20);

  return (
    <div className="card">
      <div className="card-title">TOP 100 FTSE (ROTATING 20)</div>
      <div className="etf-ticker-strip">
        {batch.map((m) => (
          <div key={m.symbol} style={{ display: "flex", gap: "6px" }}>
            <span>{m.symbol}</span>
            <span>{m.price}</span>
            <span style={{ color: m.changePct >= 0 ? "#00e58a" : "#ff4d6a" }}>
              {m.changePct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollingFtseTicker;

