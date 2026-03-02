import React from "react";

const TopBar = () => {
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="top-bar-title">GLOBALQUANTX MULTI‑ASSET DESK</div>
        <div className="top-bar-sub">
          Real‑time view across crypto, FX, equities, and ETFs – wired for algorithmic execution.
        </div>
      </div>
      <div className="top-bar-right">
        <div className="pill">
          <div className="pill-dot" />
          <span>Core routing engine: &lt; 5 ms internal latency</span>
        </div>
        <div className="user-chip">
          <div className="user-avatar" />
          <div>
            <div style={{ fontSize: 11 }}>Guest session</div>
            <div style={{ fontSize: 10, color: "var(--muted)" }}>Create an account to onboard</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;

