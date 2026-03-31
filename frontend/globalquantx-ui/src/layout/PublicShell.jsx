import React from "react";
import Footer from "./Footer.jsx";
import "../styles/layout.css";

export default function PublicShell({ children }) {
  return (
    <div className="gqx-public-shell">
      <main className="gqx-public-main">
        {children}
      </main>
      <Footer />
    </div>
  );
}

