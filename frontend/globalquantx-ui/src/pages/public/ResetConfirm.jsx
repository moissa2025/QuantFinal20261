import React, { useState } from "react";

export default function ResetConfirm() {
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  function submit(e) {
    e.preventDefault();
    // TODO: call confirmPasswordReset from authClient with token from URL
    setDone(true);
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

          <h2>Create New Password</h2>
          <p>Choose a strong password to secure your account.</p>

          {!done && (
            <form className="login-form" onSubmit={submit}>
              <label>New password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="login-button">Update Password</button>
            </form>
          )}

          {done && (
            <p style={{ marginTop: 10, fontSize: 12 }}>
              Your password has been updated. You can now{" "}
              <a href="/public/login" className="login-link">
                sign in
              </a>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

