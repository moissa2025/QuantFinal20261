import React from "react";
import "./login.css";

export default function Login() {
  return (
    <div className="gqx-login-wrapper">

      {/* Animated Asset Icons */}
      <div className="gqx-asset-icons">
        <div className="gqx-asset-icon">₿</div>
        <div className="gqx-asset-icon">Ξ</div>
        <div className="gqx-asset-icon">₣</div>
        <div className="gqx-asset-icon">📈</div>
      </div>

      {/* Main Login Layout */}
      <div className="gqx-login-container">

        {/* Login Card */}
        <div className="gqx-login-card">
          <div className="gqx-login-header">
            <h1>Sign in to GlobalQuantX</h1>
            <p>Secure access to the institutional trading and risk platform.</p>
          </div>

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
            <p>
              New to GlobalQuantX?{" "}
              <a href="#">Request Institutional Access</a>
            </p>
          </div>
        </div>

        {/* Right‑Side Info Panel */}
        <div className="gqx-login-side">
          <h2>GLOBALQUANTX MULTI-ASSET DESK</h2>
          <p>
            Real-time view across crypto, FX, equities, and ETFs – wired for
            algorithmic execution.
          </p>
          <p>Core routing engine: &lt; 5 ms internal latency</p>
          <p>Guest session — Create an account to onboard</p>

          <footer className="gqx-login-legal">
            © 2026 Bassteck — Trade Beyond Boundaries  
            <br />
            Bass Industries LTD — Company Registration: 17018032
          </footer>
        </div>

      </div>
    </div>
  );
}

