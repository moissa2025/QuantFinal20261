// pages/public/MFA.jsx
import React, { useState } from "react";
import { verifyMfa } from "../../api/authClient";

export default function MFA() {
  const [method, setMethod] = useState("totp");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await verifyMfa({ method, code });

      if (!res.session_token) {
        throw new Error("No session token returned from MFA verification.");
      }

      window.location.href = "/app/dashboard";
    } catch (err) {
      setError(err.message || "MFA verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-root">
      <div className="auth-grid-overlay" />
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo-row">
            <div className="login-logo-mark">GQ</div>
            <div className="login-logo-text">GLOBALQUANTX</div>
          </div>

          <h2>Multi-Factor Authentication</h2>
          <p>Enter your 6-digit security code to continue.</p>

          <div className="mfa-method-toggle">
            <button
              className={method === "totp" ? "active" : ""}
              onClick={() => setMethod("totp")}
              type="button"
            >
              Authenticator App
            </button>
            <button
              className={method === "email" ? "active" : ""}
              onClick={() => setMethod("email")}
              type="button"
            >
              Email Code
            </button>
          </div>

          <form className="login-form" onSubmit={submit}>
            <label>{method === "totp" ? "Authenticator code" : "Email code"}</label>
            <input
              type="text"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            {error && <div className="gqx-login-error">{error}</div>}

            <button className="login-button" disabled={loading}>
              {loading ? "Verifying..." : "Verify and Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

