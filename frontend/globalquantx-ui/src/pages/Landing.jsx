import React from "react";
import PublicTopNav from "../components/layout/PublicTopNav.jsx";
import PublicMarketsTable from "../components/markets/PublicMarketsTable.jsx";
import Footer from "../components/layout/Footer.jsx";

const Landing = () => {
  return (
    <div className="public-layout">
      <PublicTopNav />

      <main className="public-main">
        <section className="public-hero">
          <div className="public-hero-text">
            <h1>GlobalQuantX: Your Institutional Gateway to Multi‑Asset Markets</h1>
            <p className="public-hero-sub">
              Institutional‑grade execution across crypto, FX, ETFs, indices, and commodities — wired for algorithmic routing and audited flows.
            </p>
            <div className="public-hero-risk">
              Trading in digital assets and derivatives involves a high degree of risk and may not be suitable for all investors.
              You should carefully consider your investment objectives, risk tolerance, and financial situation before trading.
            </div>
          </div>
        </section>

        <section className="public-markets-section">
          <div className="public-markets-header">
            <h2>Multi‑Asset Markets</h2>
            <p>Live view across crypto, FX, ETFs, indices, and commodities.</p>
          </div>
          <PublicMarketsTable />
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;

