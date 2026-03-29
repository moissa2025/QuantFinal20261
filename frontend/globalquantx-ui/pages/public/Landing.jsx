import React from "react";

export default function Landing() {
  return (
    <main className="landing">
      <header className="hero">
        <h1>GlobalQuantX</h1>
        <h2>The Institutional Multi‑Asset Desk</h2>
        <p>
          A Bloomberg‑grade execution, analytics, and risk platform engineered for
          modern markets. Built for speed, transparency, and institutional scale.
        </p>
      </header>

      <section>
        <h3>Market Intelligence</h3>
        <p>
          Stay connected to global macro, liquidity, and cross‑asset flows with
          real‑time insights and curated institutional news.
        </p>
        <ul>
          <li><a href="https://www.bloomberg.com">Bloomberg</a></li>
          <li><a href="https://www.ft.com">Financial Times</a></li>
          <li><a href="https://www.wsj.com">Wall Street Journal</a></li>
          <li><a href="https://www.reuters.com/markets">Reuters Markets</a></li>
        </ul>
      </section>
    </main>
  );
}
