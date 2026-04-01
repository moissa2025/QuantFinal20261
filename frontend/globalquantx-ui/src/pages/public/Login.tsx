import React, { useEffect, useState } from "react";
import "./login.css";
import { setTheme } from "../../theme.js";

export default function Login() {
  const [themeState, setThemeState] = useState("dark");

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => document.body.classList.remove("login-page");
  }, []);

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
    <div className={`gqx-login-shell ${themeState}`}>

      {/* Futuristic animated background */}
      <div className="gqx-login-bg-layer"></div>
      <div className="gqx-login-grid"></div>
      <div className="gqx-login-particles"></div>

      {/* Theme toggle */}
      <button className="gqx-login-theme-toggle" onClick={toggleTheme}>
        {themeState === "dark" ? "☀️" : "🌙"}
      </button>

      {/* Centered login card */}
      <div className="gqx-login-card">
        <h1>Sign in to GlobalQuantX</h1>
        <p className="gqx-login-subtitle">
          Secure access to the institutional trading and risk platform.
        </p>

        <form className="gqx-login-form">
          <label>Email</label>
          <input type="email" placeholder="you@institution.com" />

          <label>Password</label>
          <input type="password" placeholder="••••••••" />

          <div className="gqx-login-meta">
            <a href="#">Forgot password?</a>
            <span>MFA enforced</span>
          </div>

          <button type="submit" className="gqx-login-btn">
            Sign In
          </button>
        </form>

        <div className="gqx-login-footer">
          New to GlobalQuantX? <a href="#">Request Institutional Access</a>
        </div>

        {/* Institutional Risk Disclosure */}
        <div className="gqx-login-risk">
          <strong>Risk Disclosure:</strong> Trading in digital assets, FX, equities, and derivatives involves significant risk and may not be suitable for all investors. Prices can be highly volatile and may move sharply in short periods of time. Digital asset investments are not protected by the Financial Ombudsman Service and are not covered by the Financial Services Compensation Scheme. Leveraged products carry a high risk of rapid loss. Ensure you fully understand the risks and tax implications before trading.
        </div>

      </div>

    </div>
  );
}

