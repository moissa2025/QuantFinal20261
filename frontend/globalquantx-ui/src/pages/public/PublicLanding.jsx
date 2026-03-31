// src/pages/public/PublicLogin.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function PublicLogin() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      window.location.href = "/app/dashboard";
    } catch {
      setError("Invalid credentials");
    }
  }

  return (
    <main className="-public-login">
      <h1>Sign In</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Sign In</button>
      </form>

      <section className="register">
        <h3>New to GlobalQuantX?</h3>
        <button>Request Institutional Access</button>
      </section>

      <footer className="global-footer">
        <p>
          Alerts: <a href="mailto:alerts@globalquantx.com">alerts@globalquantx.com</a> |
          Trading Desk: <a href="mailto:trading@globalquantx.com">trading@globalquantx.com</a> |
          Support: <a href="mailto:support@globalquantx.com">support@globalquantx.com</a>
        </p>
      </footer>
    </main>
  );
}

