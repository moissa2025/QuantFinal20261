import React, { useEffect, useState } from "react";
import IntelligenceLayout from "./IntelligenceLayout";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/intelligence/home")
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <IntelligenceLayout>Loading...</IntelligenceLayout>;

  return (
    <IntelligenceLayout>

      {/* HERO — GX BRIEFS */}
      <section className="gqx-intel-hero">
        <h1>Market Intelligence</h1>
        <p className="gqx-intel-subtitle">
          AI‑powered briefs across tech, markets, crypto, and macro.
        </p>

        <div className="gqx-intel-briefs-grid">
          {data.briefs.map((b) => (
            <div key={b.id} className="gqx-intel-brief-card">
              <h3>{b.headline}</h3>
              <p>{b.summary}</p>
              <div className="gqx-intel-tags">
                {b.assets.map(a => <span key={a}>{a}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MARKET SNAPSHOT */}
      <section className="gqx-intel-section">
        <h2>Market Snapshot</h2>
        <div className="gqx-intel-market-grid">
          {data.markets.topMovers.map((m) => (
            <div key={m.symbol} className="gqx-intel-market-card">
              <h4>{m.symbol}</h4>
              <p>{m.price}</p>
              <p className={m.changePct >= 0 ? "gqx-up" : "gqx-down"}>
                {m.changePct}%
              </p>
            </div>
          ))}
        </div>
      </section>

    </IntelligenceLayout>
  );
}

