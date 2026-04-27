// pages/activate/Activate.jsx
import React, { useEffect, useState } from "react";
import { activate } from "../../api/authClient";

export default function Activate() {
  const [state, setState] = useState("pending");
  const [message, setMessage] = useState("Activating your account...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setState("error");
      setMessage("Missing activation token.");
      return;
    }

    (async () => {
      try {
        await activate(token);
        setState("ok");
        setMessage("Your account is now active. You can sign in.");
      } catch (err: any) {
        setState("error");
        setMessage(err.message || "Activation failed.");
      }
    })();
  }, []);

  return (
    <div className="login-root">
      <div className="auth-grid-overlay" />
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo-row">
            <div className="login-logo-mark">GQ</div>
            <div className="login-logo-text">GLOBALQUANTX</div>
          </div>

          <h2>Account Activation</h2>
          <p>{message}</p>

          {state !== "pending" && (
            <div className="login-footer">
              <a href="/public/login" className="login-link">
                Go to sign in
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

