// pages/register/Signup.tsx
import React, { useState } from "react";
import { register } from "../../api/authClient";

export default function Signup() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    institution: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register(form);
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gqx-login-shell dark">
      <div className="gqx-login-bg-layer"></div>
      <div className="gqx-login-grid"></div>
      <div className="gqx-login-particles"></div>

      <div className="gqx-login-card">
        <h1>Request Institutional Access</h1>
        <p className="gqx-login-subtitle">
          Create a GlobalQuantX account to access the institutional trading and risk platform.
        </p>

        {!done && (
          <form className="gqx-login-form" onSubmit={submit}>
            <label>Full name</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => update("full_name", e.target.value)}
              placeholder="Jane Doe"
            />

            <label>Institutional email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@institution.com"
            />

            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="••••••••"
            />

            <label>Institution (optional)</label>
            <input
              type="text"
              value={form.institution}
              onChange={(e) => update("institution", e.target.value)}
              placeholder="Fund / Desk / Broker"
            />

            <label>Country (optional)</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder="United Kingdom"
            />

            {error && <div className="gqx-login-error">{error}</div>}

            <button type="submit" className="gqx-login-btn" disabled={loading}>
              {loading ? "Submitting..." : "Create Account"}
            </button>
          </form>
        )}

        {done && (
          <p style={{ marginTop: 12, fontSize: 13 }}>
            Check your email for an activation link. You must activate your account before signing in.
          </p>
        )}

        <div className="gqx-login-footer">
          Already have access? <a href="/public/login">Sign in</a>
        </div>
      </div>
    </div>
  );
}

