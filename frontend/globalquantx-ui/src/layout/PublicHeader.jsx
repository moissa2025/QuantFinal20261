import React, { useState, useEffect } from "react";
import "../styles/layout.css";
import { setTheme } from "../theme.js";
import MarketTicker from "../components/MarketTicker.jsx";

export default function PublicHeader() {
  const [themeState, setThemeState] = useState("dark");

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    setThemeState(saved);
  }, []);

  // Scroll transition effect
  useEffect(() => {
    const onScroll = () => {
      const wrapper = document.querySelector(".gqx-public-header-wrapper");
      if (window.scrollY > 20) wrapper.classList.add("scrolled");
      else wrapper.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    const next = themeState === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  }

  return (
    <>
      {/* HEADER */}
      <div className="gqx-public-header-wrapper">
        <div className="gqx-public-header-top">
          <div className="gqx-public-logo">GLOBALQUANTX</div>

          <nav className="gqx-public-nav">
            <a href="/marketing">Marketing</a>
            <a href="/docs">Docs</a>
            <a href="/careers">Careers</a>
            <a href="/api">API Explorer</a>
            <a href="/login" className="gqx-nav-login">Login</a>
          </nav>

          <button className="gqx-theme-toggle" onClick={toggleTheme}>
            {themeState === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* TICKER BELOW HEADER */}
      <div className="gqx-public-ticker-bar">
        <MarketTicker />
      </div>
    </>
  );
}

