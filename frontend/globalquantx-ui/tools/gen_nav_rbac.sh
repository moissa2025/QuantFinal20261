#!/bin/bash

set -e

ROOT="../src"
LAYOUT_DIR="$ROOT/layout"
CONTEXT_DIR="$ROOT/context"
CONFIG_DIR="$ROOT/config"

mkdir -p "$LAYOUT_DIR" "$CONTEXT_DIR" "$CONFIG_DIR"

echo "🚀 Generating RBAC + Navigation + AppShell..."

########################################
# 1) Roles + Permissions Matrix
########################################

cat > "$CONFIG_DIR/roles.js" << 'EOF'
// src/config/roles.js

export const ROLES = {
  ADMIN: "admin",
  TRADER: "trader",
  CLIENT: "client",
  SUPPORT: "support",
  PUBLIC: "public",
};

export const PERMISSIONS = {
  VIEW_ADMIN: "view_admin",
  VIEW_TRADING: "view_trading",
  VIEW_ANALYTICS: "view_analytics",
  VIEW_PUBLIC: "view_public",
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_ADMIN,
    PERMISSIONS.VIEW_TRADING,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_PUBLIC,
  ],
  [ROLES.TRADER]: [
    PERMISSIONS.VIEW_TRADING,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_PUBLIC,
  ],
  [ROLES.CLIENT]: [
    PERMISSIONS.VIEW_TRADING,
    PERMISSIONS.VIEW_PUBLIC,
  ],
  [ROLES.SUPPORT]: [
    PERMISSIONS.VIEW_ADMIN,
    PERMISSIONS.VIEW_PUBLIC,
  ],
  [ROLES.PUBLIC]: [
    PERMISSIONS.VIEW_PUBLIC,
  ],
};

export function hasPermission(role, permission) {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission);
}
EOF

########################################
# 2) Server-driven Navigation Model
########################################

cat > "$CONFIG_DIR/navigationModel.js" << 'EOF'
// src/config/navigationModel.js

import { PERMISSIONS } from "./roles";

export const NAV_SECTIONS = [
  {
    id: "admin",
    label: "Admin",
    permission: PERMISSIONS.VIEW_ADMIN,
    items: [
      { id: "admin-dashboard", label: "Admin Dashboard", path: "/admin/dashboard" },
      { id: "admin-ledger", label: "Admin Ledger", path: "/admin/ledger" },
      { id: "admin-risk", label: "Admin Risk", path: "/admin/risk" },
      { id: "admin-system", label: "Admin System", path: "/admin/system" },
      { id: "admin-users", label: "Admin Users", path: "/admin/users" },
    ],
  },
  {
    id: "trading",
    label: "Trading",
    permission: PERMISSIONS.VIEW_TRADING,
    items: [
      { id: "order-entry", label: "Order Entry", path: "/app/order-entry" },
      { id: "portfolio", label: "Portfolio", path: "/app/portfolio" },
      { id: "positions", label: "Positions", path: "/app/positions" },
      { id: "market", label: "Market", path: "/app/market" },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    permission: PERMISSIONS.VIEW_ANALYTICS,
    items: [
      { id: "alpha-decay", label: "Alpha Decay", path: "/app/alpha/decay" },
      { id: "correlation", label: "Correlation", path: "/app/correlation" },
      { id: "capacity", label: "Capacity", path: "/app/capacity" },
    ],
  },
  {
    id: "public",
    label: "Public",
    permission: PERMISSIONS.VIEW_PUBLIC,
    items: [
      { id: "landing", label: "Landing", path: "/public/landing" },
      { id: "login", label: "Login", path: "/public/login" },
      { id: "legal-privacy", label: "Legal Privacy", path: "/public/legal/privacy" },
      { id: "legal-terms", label: "Legal Terms", path: "/public/legal/terms" },
      { id: "support", label: "Support", path: "/public/support" },
    ],
  },
];
EOF

########################################
# 3) AuthContext with Role
########################################

cat > "$CONTEXT_DIR/AuthContext.jsx" << 'EOF'
// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useMemo } from "react";
import { ROLES } from "../config/roles";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // In reality, hydrate from token / backend
  const [user, setUser] = useState({
    id: "demo-user",
    name: "Demo User",
    role: ROLES.ADMIN, // change to test: ROLES.TRADER, ROLES.CLIENT, etc.
  });

  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
EOF

########################################
# 4) Collapsible, RBAC-aware Sidebar
########################################

cat > "$LAYOUT_DIR/Sidebar.jsx" << 'EOF'
// src/layout/Sidebar.jsx

import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { NAV_SECTIONS } from "../config/navigationModel";
import { hasPermission } from "../config/roles";
import { useAuth } from "../context/AuthContext";
import "./os-shell.css";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  const [openSections, setOpenSections] = useState(() =>
    NAV_SECTIONS.map((s) => s.id)
  );

  const toggleSection = (id) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">GlobalQuantX</div>
        <div className="sidebar-subtitle">Institutional Desk</div>
      </div>

      <div className="sidebar-sections">
        {NAV_SECTIONS.filter((section) =>
          hasPermission(user.role, section.permission)
        ).map((section) => {
          const isOpen = openSections.includes(section.id);
          return (
            <div key={section.id} className="sidebar-section">
              <button
                className="sidebar-section-header"
                onClick={() => toggleSection(section.id)}
              >
                <span>{section.label}</span>
                <span className="sidebar-section-chevron">
                  {isOpen ? "▾" : "▸"}
                </span>
              </button>
              {isOpen && (
                <div className="sidebar-items">
                  {section.items.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        className={
                          "sidebar-item" + (active ? " sidebar-item-active" : "")
                        }
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
EOF

########################################
# 5) Role-aware AppShell
########################################

cat > "$LAYOUT_DIR/AppShell.jsx" << 'EOF'
// src/layout/AppShell.jsx

import React from "react";
import Sidebar from "./Sidebar.jsx";
import { useAuth } from "../context/AuthContext";
import "./os-shell.css";

export default function AppShell({ children }) {
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <header className="app-header">
          <div className="app-header-left">
            <div className="app-header-title">Control Plane</div>
            <div className="app-header-subtitle">
              Signed in as {user.name} ({user.role})
            </div>
          </div>
          <div className="app-header-right">
            {/* Placeholder for notifications, profile, etc. */}
            <span className="app-header-pill">Simulated Alerts</span>
          </div>
        </header>
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
EOF

########################################
# 6) Minimal os-shell.css upgrades
########################################

cat > "$LAYOUT_DIR/os-shell.css" << 'EOF'
/* src/layout/os-shell.css */

.app-shell {
  display: flex;
  height: 100vh;
  background: #020412;
  color: #e5e7eb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Segoe UI", sans-serif;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: #050814;
  border-right: 1px solid #151a2a;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  overflow-y: auto;
  overflow-x: hidden;
  height: 100vh;
  scrollbar-width: thin;
}

.sidebar-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #f9fafb;
}

.sidebar-subtitle {
  font-size: 11px;
  color: #6b7280;
}

.sidebar-sections {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-section {
  border-radius: 6px;
  background: #050814;
}

.sidebar-section-header {
  width: 100%;
  padding: 6px 8px;
  background: transparent;
  border: none;
  color: #9ca3af;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.sidebar-section-header:hover {
  background: #0b1020;
}

.sidebar-section-chevron {
  font-size: 11px;
}

.sidebar-items {
  display: flex;
  flex-direction: column;
  padding: 4px 0 6px 0;
}

.sidebar-item {
  padding: 6px 10px;
  font-size: 13px;
  color: #9ca3af;
  text-decoration: none;
  border-radius: 4px;
}

.sidebar-item:hover {
  background: #0b1020;
  color: #e5e7eb;
}

.sidebar-item-active {
  background: #111827;
  color: #f9fafb;
}

/* Main area */
.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.app-header {
  height: 56px;
  border-bottom: 1px solid #151a2a;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-header-title {
  font-size: 16px;
  font-weight: 500;
}

.app-header-subtitle {
  font-size: 12px;
  color: #9ca3af;
}

.app-header-pill {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #111827;
  color: #e5e7eb;
}

.app-content {
  padding: 16px;
  overflow: auto;
}
EOF

########################################
# 7) Layout wrapper (if not already)
########################################

cat > "$LAYOUT_DIR/Layout.jsx" << 'EOF'
// src/layout/Layout.jsx

import React from "react";
import AppShell from "./AppShell.jsx";

export default function Layout({ children }) {
  return <AppShell>{children}</AppShell>;
}
EOF

echo "🎉 RBAC + Navigation + AppShell generated."

