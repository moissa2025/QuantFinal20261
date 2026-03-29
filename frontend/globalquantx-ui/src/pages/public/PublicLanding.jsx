import React from "react";

export default function PublicLanding() {
  return (
    <main className="-public-landing">

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
        <ul>
          <li><a href="https://www.bloomberg.com">Bloomberg</a></li>
          <li><a href="https://www.ft.com">Financial Times</a></li>
          <li><a href="https://www.wsj.com">Wall Street Journal</a></li>
          <li><a href="https://www.reuters.com/markets">Reuters Markets</a></li>
        </ul>
      </section>
    
      <footer className="global-footer">
        <p>
          Alerts: <a href="mailto:alerts@globalquantx.com">alerts@globalquantx.com</a> |
          {" "}Trading Desk: <a href="mailto:trading@globalquantx.com">trading@globalquantx.com</a> |
          {" "}Support: <a href="mailto:support@globalquantx.com">support@globalquantx.com</a>
        </p>

      </footer>
    </main>
  );
}
