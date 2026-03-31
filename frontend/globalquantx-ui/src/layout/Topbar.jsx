import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";   // ← add this
import "../styles/layout.css";

export default function Topbar() {
  const location = useLocation();
  const { logout } = useAuth();   // ← get logout from context

  const pageTitle = location.pathname
    .replace("/app/", "")
    .replace("-", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="gqx-topbar">
      <div className="gqx-topbar-title">{pageTitle || "Dashboard"}</div>

      <div className="gqx-topbar-right">
        <button className="gqx-topbar-btn">Search</button>
        <button className="gqx-topbar-btn">Theme</button>
        <button className="gqx-topbar-btn">Notifications</button>

        {/* 🔥 LOGOUT BUTTON */}
        <button className="gqx-topbar-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

