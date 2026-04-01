import React, { useEffect, useState } from "react";
import "./login.css";
import { setTheme } from "../../theme.js";

export default function Login() {
  const [themeState, setThemeState] = useState("dark");

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
      </div>

    </div>
  );
}

