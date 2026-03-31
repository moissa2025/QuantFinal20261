import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function PublicLogin() {
  const { login } = useAuth();

  const [stage, setStage] = useState("login"); // "login" | "mfa"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const result = await login(email, password);
      if (result && result.mfa_required) {
        setStage("mfa");
      } else {
        window.location.href = "/app/dashboard";
      }
    } catch {
      setError("Invalid credentials");
    }
  }

  async function handleMfa(e) {
    e.preventDefault();
    setError("");

    try {
      // TODO: call verifyMfa from authClient when backend is ready
      window.location.href = "/app/dashboard";
    } catch {
      setError("Invalid code");
    }
  }

  return (
    <div className="login-root">
        {/* Futuristic quant background */}
    <div className="quant-bg-gradient"></div>
    <div className="quant-bg-grid"></div>
    <div className="quant-bg-particles"></div>
      <div className="auth-grid-overlay" />

      <div className="login-hero">
        <div className="login-hero-tag">
          <span className="login-hero-tag-dot" />
          LIVE MARKET INFRASTRUCTURE
        </div>
        <h1 className="login-hero-title">GlobalQuantX Control Surface</h1>
        <p className="login-hero-subtitle">
          Unified execution, risk, and liquidity intelligence for institutional desks.
        </p>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-logo-row">
            <div className="login-logo-mark">GQ</div>
            <div className="login-logo-text">GLOBALQUANTX</div>
          </div>

          <p className="login-subtitle">
            Sign in with your institutional credentials to access the trading console.
          </p>

          {stage === "login" && (
            <form className="login-form" onSubmit={handleLogin}>
              {error && <div className="login-error">{error}</div>}

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

              <div className="login-links-row">
                <a href="/public/reset" className="login-link">
                  Forgot password
                </a>
                <span className="login-link">MFA enforced</span>
              </div>

              <button className="login-button">Sign In</button>
            </form>
          )}

          {stage === "mfa" && (
            <div className="mfa-card">
              {error && <div className="login-error">{error}</div>}

              <h2>Multi‑Factor Authentication</h2>
              <p>Enter the 6‑digit code from your authenticator app.</p>

              <form className="login-form" onSubmit={handleMfa}>
                <input
                  className="mfa-input"
                  type="text"
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                />
                <button className="login-button" style={{ marginTop: 12 }}>
                  Verify
                </button>
              </form>
            </div>
          )}

          <div className="login-footer">
            <p>New to GlobalQuantX?</p>
            <button
              className="login-secondary-button"
              type="button"
            >
              Request Institutional Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

