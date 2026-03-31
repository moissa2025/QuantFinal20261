import React, { useState } from "react";

export default function ResetRequest() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function submit(e) {
    e.preventDefault();
    // TODO: call requestPasswordReset from authClient
    setSent(true);
  }

  return (
    <div className="login-root">
      <div className="auth-grid-overlay" />

      <div className="login-container">
        <div className="login-card reset-card">
          <div className="login-logo-row">
            <div className="login-logo-mark">GQ</div>
            <div className="login-logo-text">GLOBALQUANTX</div>
          </div>

          <h2>Reset Password</h2>
          <p>Enter your email to receive a secure reset link.</p>

          {!sent && (
            <form className="login-form" onSubmit={submit}>
              <label>Email</label>
              <input
                type="email"
                placeholder="you@institution.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="login-button">Send Reset Link</button>
            </form>
          )}

          {sent && (
            <p style={{ marginTop: 10, fontSize: 12 }}>
              If an account exists for this email, a reset link has been sent.
            </p>
          )}

          <div className="login-footer">
            <a href="/public/login" className="login-link">
              Back to sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

