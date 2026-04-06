import React, { useEffect, useState } from "react";
import IntelligenceLayout from "./IntelligenceLayout";

export default function Markets() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/intelligence/markets")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <IntelligenceLayout>
        <p>Loading markets…</p>
      </IntelligenceLayout>
    );
  }

  return (
    <IntelligenceLayout>
      <section className="gqx-intel-section">
        <h1>Markets</h1>
        <p className="gqx-intel-subtitle">
          Multi‑asset snapshot with GX Quant Scores.
        </p>

        <div className="gqx-intel-market-table">
          <div className="gqx-intel-market-header">
            <span>Symbol</span>
            <span>Price</span>
            <span>Change</span>
            <span>GX Score</span>
          </div>
          {data.assets.map(a => (
            <a
              key={a.symbol}
              href={`/intelligence/tickers/${a.symbol}`}
              className="gqx-intel-market-row"
            >
              <span>{a.symbol}</span>
              <span>{a.price}</span>
              <span className={a.changePct >= 0 ? "gqx-up" : "gqx-down"}>
                {a.changePct}%
              </span>
              <span>{a.quantScore}</span>
            </a>
          ))}
        </div>
      </section>
    </IntelligenceLayout>
  );
}

