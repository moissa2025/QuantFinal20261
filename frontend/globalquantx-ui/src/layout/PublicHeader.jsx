import React, { useState, useEffect } from "react";
import "../styles/layout.css";
import { setTheme } from "../theme.js"; // your theme system

export default function PublicHeader() {
  const [themeState, setThemeState] = useState("dark");

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    setThemeState(saved);
  }, []);

  function toggleTheme() {
    const next = themeState === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  }

  return (
    <div className="gqx-public-header-wrapper">

      {/* Theme Toggle */}
      <button className="gqx-theme-toggle" onClick={toggleTheme}>
        {themeState === "dark" ? "☀️" : "🌙"}
      </button>

      {/* Header */}
      <header className="gqx-public-header">
        <div className="gqx-public-logo">GLOBALQUANTX</div>
        <div className="gqx-public-tagline">
          Institutional Trading & Risk Platform
        </div>
      </header>

    </div>
  );
}

