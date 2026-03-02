import React, { useState } from "react";
import Page from "../components/layout/Page.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to auth-service
  };

  return (
    <Page title="Login" subtitle="Secure access for institutional users">
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div className="field-label">Work email</div>
          <input
            className="field-input"
            type="email"
            required
            value={form.email}
            onChange={handleChange("email")}
          />
        </div>
        <div>
          <div className="field-label">Password</div>
          <input
            className="field-input"
            type="password"
            required
            value={form.password}
            onChange={handleChange("password")}
          />
        </div>
        <button className="btn-primary" type="submit">
          Sign in
        </button>
      </form>
    </Page>
  );
};

export default Login;

