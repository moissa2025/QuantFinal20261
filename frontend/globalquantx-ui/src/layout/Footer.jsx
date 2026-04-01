import React from "react";
import "../styles/layout.css";

export default function Footer() {
  return (
    <footer className="gqx-footer">
      <div className="gqx-footer-section">
        <div className="gqx-footer-title">GLOBALQUANTX MULTI‑ASSET DESK</div>
        <div>Real‑time view across crypto, FX, equities, and ETFs – wired for algorithmic execution.</div>
        <div>Core routing engine: &lt; 5 ms internal latency</div>
        <div>Guest session — Create an account to onboard</div>
      </div>

      <hr className="gqx-footer-divider" />

      <div className="gqx-footer-section">
        <div>© 2026 Bassteck — Trade Beyond Boundaries</div>
        <div>Bass Industries LTD — Company Registration: 17018032</div>
      </div>
    </footer>
  );
}

