// public/Logout.jsx
import React, { useEffect } from "react";
import { logout } from "../api/authClient";

export default function Logout() {
  useEffect(() => {
    (async () => {
      try {
        await logout();
      } catch {
        // ignore
      } finally {
        sessionStorage.removeItem("gqx_token");
        sessionStorage.removeItem("gqx_pending_email");
        window.location.href = "/public/login";
      }
    })();
  }, []);

  return (
    <div className="login-root">
      <div className="auth-grid-overlay" />
      <div className="login-container">
        <div className="login-card">
          <h2>Signing you out…</h2>
        </div>
      </div>
    </div>
  );
}

