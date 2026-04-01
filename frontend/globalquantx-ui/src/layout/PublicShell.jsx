import PublicHeader from "./PublicHeader.jsx";
import MarketTicker from "../components/MarketTicker.jsx";
import React from "react";
import "../styles/layout.css";
import Footer from "./Footer.jsx";   // ← THIS WAS MISSING

export default function PublicShell({ children }) {
  return (
    <div className="gqx-public-shell">
      <PublicHeader />
      <main className="gqx-public-main">{children}</main>
      <Footer />
    </div>
  );
}

