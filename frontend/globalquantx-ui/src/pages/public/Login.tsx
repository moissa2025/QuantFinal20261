// pages/public/Login.tsx
import React, { useEffect, useState } from "react";
import "./login.css";
import { setTheme } from "../../theme.js";
import { login } from "../../api/authClient";

export default function Login() {
  const [themeState, setThemeState] = useState("dark");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await login(email, password);

      if (res.mfa_required) {
        sessionStorage.setItem("gqx_pending_email", email);
        window.location.href = "/public/mfa";
        return;
      }

      if (res.session_token) {
        window.location.href = "/app/dashboard";
        return;
      }

      setError("Unexpected response from server.");
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`gqx-login-shell ${themeState}`}>
      <div className="gqx-login-bg-layer"></div>
      <div className="gqx-login-grid"></div>
      <div className="gqx-login-particles"></div>

      <button className="gqx-login-theme-toggle" onClick={toggleTheme}>
        {themeState === "dark" ? "☀️" : "🌙"}
      </button>

      <div className="gqx-login-card">
        <h1>Sign in to GlobalQuantX</h1>
        <p className="gqx-login-subtitle">
          Secure access to the institutional trading and risk platform.
        </p>

        <form className="gqx-login-form" onSubmit={submit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="you@institution.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="gqx-login-meta">
            <a href="/public/reset-request">Forgot password?</a>
            <span>MFA enforced</span>
          </div>

          {error && <div className="gqx-login-error">{error}</div>}

          <button type="submit" className="gqx-login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="gqx-login-footer">
          New to GlobalQuantX?{" "}
          <a href="/register/Signup">Request Institutional Access</a>
        </div>
      </div>
    </div>
  );
}

