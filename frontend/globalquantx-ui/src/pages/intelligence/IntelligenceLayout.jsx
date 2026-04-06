import React from "react";
import "../../styles/layout.css";

export default function IntelligenceLayout({ children }) {
  return (
    <div className="gqx-intel-shell">

      {/* HEADER (reuse your existing public header) */}
      <div className="gqx-public-header-wrapper">
        <div className="gqx-public-header-top">
          <div className="gqx-public-logo">GLOBALQUANTX</div>

          <nav className="gqx-public-nav">
            <a href="/intelligence">Home</a>
            <a href="/intelligence/news">News</a>
            <a href="/intelligence/markets">Markets</a>
            <a href="/intelligence/tech">Tech</a>
            <a href="/intelligence/crypto">Crypto</a>
            <a href="/intelligence/themes">Themes</a>
            <a href="/intelligence/search">Search</a>
          </nav>
        </div>
      </div>

      {/* TICKER BAR */}
      <div className="gqx-public-ticker-bar">
        {/* You will later inject live ticker items here */}
      </div>

      {/* MAIN CONTENT */}
      <main className="gqx-public-main">
        {children}
      </main>
    </div>
  );
}

