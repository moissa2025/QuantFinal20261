#!/bin/bash
set -e

ROOT="../src"
LAYOUT_DIR="$ROOT/layout"
CONTEXT_DIR="$ROOT/context"
CONFIG_DIR="$ROOT/config"

mkdir -p "$LAYOUT_DIR" "$CONTEXT_DIR" "$CONFIG_DIR"

echo "🚀 Generating platform: routes + RBAC + nav + AppShell + command palette + themes + role landing"

###############################################
# Helpers for short codes
###############################################
shortcode() {
  local input="$1"
  input=$(echo "$input" | sed 's/[A-Z]/ &/g' | awk '{print tolower($1)}')
  echo "${input:0:3}"
}

file_code_for() {
  local name="$1"
  case "$name" in
    Dashboard|AdminDashboard) echo "dash" ;;
    Ledger|AdminLedger|AppLedger) echo "led" ;;
    Risk|AdminRisk|RiskCenter|PortfolioRisk) echo "rsk" ;;
    System|AdminSystem) echo "sys" ;;
    Users|AdminUsers) echo "usr" ;;
    Market|AppMarket) echo "mkt" ;;
    Portfolio|AppPortfolio) echo "pfl" ;;
    Positions|AppPositions) echo "pos" ;;
    OrderEntry|AppOrderEntry) echo "ord" ;;
    Notifications|AppNotifications) echo "not" ;;
    NotificationTemplates|AppNotificationTemplates) echo "ntp" ;;
    Trading|AppTrading) echo "trd" ;;
    SystemStatus|AppSystemStatus) echo "sts" ;;
    Support|AppSupport|PublicSupport) echo "sup" ;;
    Login|PublicLogin) echo "lgn" ;;
    Landing|PublicLanding) echo "lnd" ;;
    Privacy|PublicPrivacy) echo "pri" ;;
    Terms|PublicTerms|LegalTerms) echo "ter" ;;
    LegalPrivacy|PublicLegalPrivacy) echo "lpr" ;;
    LegalRisk|PublicLegalRisk) echo "lrk" ;;
    AlphaDecay) echo "dec" ;;
    LiquidityMap) echo "map" ;;
    ExecutionReplay) echo "rep" ;;
    *) shortcode "$name" ;;
  esac
}

folder_code_for() {
  local sub="$1"
  case "$sub" in
    "."|"") echo "" ;;
    liquidity) echo "liq" ;;
    execution) echo "exe" ;;
    alpha) echo "alp" ;;
    market) echo "mkt" ;;
    portfolio) echo "pfl" ;;
    positions) echo "pos" ;;
    risk) echo "rsk" ;;
    system) echo "sys" ;;
    legal) echo "leg" ;;
    *) shortcode "$sub" ;;
  esac
}

cat_code_for() {
  local cat="$1"
  case "$cat" in
    admin) echo "adm" ;;
    app) echo "app" ;;
    public) echo "pub" ;;
    *) shortcode "$cat" ;;
  esac
}

###############################################
# 1) Roles + Permissions
###############################################
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

###############################################
# 2) Navigation model (labels refined)
###############################################
cat > "$CONFIG_DIR/navigationModel.js" << 'EOF'
// src/config/navigationModel.js

import { PERMISSIONS } from "./roles";

export const NAV_SECTIONS = [
  {
    id: "admin",
    label: "Control Center",
    permission: PERMISSIONS.VIEW_ADMIN,
    items: [
      { id: "adm-dash", label: "Dashboard", path: "/adm/dash" },
      { id: "adm-led", label: "Ledger", path: "/adm/led" },
      { id: "adm-rsk", label: "Risk Center", path: "/adm/rsk" },
      { id: "adm-sys", label: "System", path: "/adm/sys" },
      { id: "adm-usr", label: "Users", path: "/adm/usr" },
    ],
  },
  {
    id: "trading",
    label: "Trading Desk",
    permission: PERMISSIONS.VIEW_TRADING,
    items: [
      { id: "app-mkt", label: "Market", path: "/app/mkt" },
      { id: "app-pos", label: "Positions", path: "/app/pos" },
      { id: "app-ord", label: "Order Entry", path: "/app/ord" },
      { id: "app-pfl", label: "Portfolio", path: "/app/pfl" },
    ],
  },
  {
    id: "analytics",
    label: "Analytics Lab",
    permission: PERMISSIONS.VIEW_ANALYTICS,
    items: [
      { id: "adm-dec", label: "Alpha Decay", path: "/adm/alp/dec" },
      { id: "adm-map", label: "Liquidity Map", path: "/adm/liq/map" },
      { id: "adm-rep", label: "Execution Replay", path: "/adm/exe/rep" },
    ],
  },
  {
    id: "public",
    label: "Public Pages",
    permission: PERMISSIONS.VIEW_PUBLIC,
    items: [
      { id: "pub-lnd", label: "Home", path: "/pub/lnd" },
      { id: "pub-lgn", label: "Login", path: "/pub/lgn" },
      { id: "pub-lpr", label: "Legal Privacy", path: "/pub/lpr" },
      { id: "pub-ter", label: "Legal Terms", path: "/pub/ter" },
      { id: "pub-sup", label: "Support", path: "/pub/sup" },
    ],
  },
];

export const NAV_ITEMS_FLAT = NAV_SECTIONS.flatMap((section) =>
  section.items.map((item) => ({
    ...item,
    sectionId: section.id,
    sectionLabel: section.label,
  }))
);
EOF

###############################################
# 3) AuthContext with role-based landing helper
###############################################
cat > "$CONTEXT_DIR/AuthContext.jsx" << 'EOF'
// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useMemo } from "react";
import { ROLES } from "../config/roles";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // TODO: hydrate from real auth backend
  const [user, setUser] = useState({
    id: "demo-user",
    name: "Demo User",
    role: ROLES.ADMIN, // change to test: TRADER, CLIENT, SUPPORT, PUBLIC
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

// Role-based landing mapping
export function getLandingPathForRole(role) {
  switch (role) {
    case ROLES.ADMIN:
      return "/adm/dash";   // Admin → Dashboard
    case ROLES.TRADER:
      return "/app/mkt";    // Trader → Market
    case ROLES.CLIENT:
      return "/app/pfl";    // Client → Portfolio
    case ROLES.SUPPORT:
      return "/adm/usr";    // Support → Users
    case ROLES.PUBLIC:
    default:
      return "/pub/lnd";    // Public → Home
  }
}
EOF

###############################################
# 4) CommandPalette (unchanged behavior)
###############################################
cat > "$LAYOUT_DIR/CommandPalette.jsx" << 'EOF'
// src/layout/CommandPalette.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { NAV_ITEMS_FLAT } from "../config/navigationModel";
import "./os-shell.css";

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const handler = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return NAV_ITEMS_FLAT;
    return NAV_ITEMS_FLAT.filter((item) => {
      return (
        item.label.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q) ||
        item.sectionLabel.toLowerCase().includes(q)
      );
    });
  }, [query]);

  const handleSelect = (item) => {
    navigate(item.path);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="cmd-overlay">
      <div className="cmd-panel">
        <input
          autoFocus
          className="cmd-input"
          placeholder="Search pages, symbols, analytics…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="cmd-results">
          {results.length === 0 && (
            <div className="cmd-empty">No matches. Try another query.</div>
          )}
          {results.map((item) => {
            const cmd = item.path.replace(/^\//, "");
            return (
              <button
                key={item.id}
                className="cmd-item"
                onClick={() => handleSelect(item)}
              >
                <div className="cmd-item-main">
                  <span className="cmd-item-label">{item.label}</span>
                  <span className="cmd-item-section">
                    {item.sectionLabel}
                  </span>
                </div>
                <span className="cmd-item-short">{cmd}</span>
              </button>
            );
          })}
        </div>
        <div className="cmd-footer">
          <span>↩ Enter to navigate</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}
EOF

###############################################
# 5) Sidebar (labels already updated via NAV_SECTIONS)
###############################################
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
        <div className="sidebar-subtitle">Institutional Multi-Asset Desk</div>
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
                    const cmd = item.path.replace(/^\//, "");
                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        title={`${item.label} (${cmd})`}
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

###############################################
# 6) AppShell (same, but labels now match model)
###############################################
cat > "$LAYOUT_DIR/AppShell.jsx" << 'EOF'
// src/layout/AppShell.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import CommandPalette from "./CommandPalette.jsx";
import { useAuth } from "../context/AuthContext";
import "./os-shell.css";

const THEMES = ["dark", "midnight", "terminal", "bloomberg"];

export default function AppShell({ children }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState("dark");
  const [cmdOpen, setCmdOpen] = useState(false);
  const navigate = useNavigate();
  const [lastKey, setLastKey] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
        return;
      }

      const key = e.key.toLowerCase();
      if (lastKey === "g" && key === "d") {
        navigate("/adm/dash");
        setLastKey(null);
        return;
      }
      if (lastKey === "g" && key === "m") {
        navigate("/app/mkt");
        setLastKey(null);
        return;
      }
      setLastKey(key);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lastKey, navigate]);

  const themeClass = `theme-${theme}`;

  return (
    <div className={`app-shell ${themeClass}`}>
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
            <div className="app-header-theme">
              <span>Theme:</span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="app-header-theme-select"
              >
                <option value="dark">Dark</option>
                <option value="midnight">Midnight</option>
                <option value="terminal">Terminal</option>
                <option value="bloomberg">Bloomberg-Black</option>
              </select>
            </div>
            <button className="app-header-icon" title="Notifications">
              🔔
            </button>
            <button className="app-header-icon" title="Quick actions">
              ⚡
            </button>
            <div className="app-header-user">
              <div className="app-header-avatar">
                {user.name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            </div>
            <span className="app-header-pill">CMD: ⌘K · g d · g m</span>
          </div>
        </header>
        <main className="app-content">{children}</main>
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </div>
  );
}
EOF

###############################################
# 7) Layout wrapper
###############################################
cat > "$LAYOUT_DIR/Layout.jsx" << 'EOF'
// src/layout/Layout.jsx

import React from "react";
import AppShell from "./AppShell.jsx";

export default function Layout({ children }) {
  return <AppShell>{children}</AppShell>;
}
EOF

###############################################
# 8) os-shell.css (unchanged from previous version)
###############################################
cat > "$LAYOUT_DIR/os-shell.css" << 'EOF'
/* src/layout/os-shell.css */

/* Base shell */
.app-shell {
  display: flex;
  height: 100vh;
  color: #e5e7eb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
    "Segoe UI", sans-serif;
}

/* Themes */
.theme-dark {
  background: #020412;
}

.theme-midnight {
  background: radial-gradient(circle at top, #111827 0, #020412 55%);
}

.theme-terminal {
  background: #020412;
  color: #d1fae5;
}

.theme-terminal .sidebar,
.theme-terminal .app-header,
.theme-terminal .app-content {
  background-color: #020617;
  border-color: #064e3b;
}

.theme-bloomberg {
  background: #000000;
}

.theme-bloomberg .sidebar {
  background: #050505;
  border-right-color: #202020;
}

.theme-bloomberg .app-header {
  background: #050505;
  border-bottom-color: #202020;
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

.app-header-left {
  display: flex;
  flex-direction: column;
}

.app-header-title {
  font-size: 16px;
  font-weight: 500;
}

.app-header-subtitle {
  font-size: 12px;
  color: #9ca3af;
}

.app-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-header-pill {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #111827;
  color: #e5e7eb;
}

.app-header-theme {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #9ca3af;
}

.app-header-theme-select {
  background: #020617;
  color: #e5e7eb;
  border-radius: 999px;
  border: 1px solid #1f2937;
  padding: 2px 8px;
  font-size: 11px;
}

.app-header-icon {
  border: none;
  background: #020617;
  color: #e5e7eb;
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 13px;
  cursor: pointer;
}

.app-header-icon:hover {
  background: #111827;
}

.app-header-user {
  display: flex;
  align-items: center;
}

.app-header-avatar {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #e5e7eb;
}

.app-content {
  padding: 16px;
  overflow: auto;
}

/* Command palette */
.cmd-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px;
  z-index: 50;
}

.cmd-panel {
  width: 560px;
  max-height: 480px;
  background: #020617;
  border-radius: 12px;
  border: 1px solid #1f2937;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
}

.cmd-input {
  width: 100%;
  border: none;
  outline: none;
  background: #020617;
  color: #f9fafb;
  padding: 10px 12px;
  border-bottom: 1px solid #111827;
  font-size: 14px;
}

.cmd-results {
  max-height: 360px;
  overflow-y: auto;
}

.cmd-item {
  width: 100%;
  padding: 8px 12px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  color: #e5e7eb;
  font-size: 13px;
}

.cmd-item:hover {
  background: #111827;
}

.cmd-item-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.cmd-item-label {
  font-size: 13px;
}

.cmd-item-section {
  font-size: 11px;
  color: #9ca3af;
}

.cmd-item-short {
  font-size: 11px;
  color: #9ca3af;
}

.cmd-empty {
  padding: 10px 12px;
  font-size: 13px;
  color: #9ca3af;
}

.cmd-footer {
  border-top: 1px solid #111827;
  padding: 6px 10px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #6b7280;
}
EOF

###############################################
# 9) GeneratedRoutes.jsx with root + short-codes
###############################################
OUT_ROUTES="$LAYOUT_DIR/GeneratedRoutes.jsx"
rm -f "$OUT_ROUTES"

cat > "$OUT_ROUTES" << 'EOF'
// AUTO-GENERATED BY tools/gen_platform.sh
// Do not edit manually.

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, getLandingPathForRole } from "../context/AuthContext.jsx";
EOF

echo "" >> "$OUT_ROUTES"

FILES=$(find "$ROOT/pages" -type f -name "*.jsx" \
  | grep -E "pages/(admin|app|public)/" \
  | sort)

COMPONENTS=()

for FILE in $FILES; do
  REL=${FILE#../src/}
  IMPORT_PATH="../${REL%.jsx}"
  CATEGORY=$(echo "$REL" | cut -d'/' -f2)
  SUBPATH=$(dirname "${REL#pages/$CATEGORY/}")
  NAME=$(basename "$REL" .jsx)

  CAP_CAT="$(tr '[:lower:]' '[:upper:]' <<< ${CATEGORY:0:1})${CATEGORY:1}"
  if [[ "$SUBPATH" == "." ]]; then
    FOLDER_PART=""
  else
    FOLDER_PART=$(echo "$SUBPATH" | sed -E 's/(^|\/)([a-z])/\U\2/g' | tr -d '/')
  fi
  COMPONENT_NAME="${CAP_CAT}${FOLDER_PART}${NAME}"

  COMPONENTS+=("$CATEGORY|$SUBPATH|$NAME|$COMPONENT_NAME")

  echo "import ${COMPONENT_NAME} from \"${IMPORT_PATH}.jsx\";" >> "$OUT_ROUTES"
done

cat >> "$OUT_ROUTES" << 'EOF'

function RoleLandingRedirect() {
  const { user } = useAuth();
  const target = getLandingPathForRole(user.role);
  return <Navigate to={target} replace />;
}

export default function GeneratedRoutes() {
  return (
    <Routes>
      {/* Root: role-based landing */}
      <Route path="/" element={<RoleLandingRedirect />} />
EOF

# Explicit /pub/lnd mapping if Landing exists
for ITEM in "${COMPONENTS[@]}"; do
  IFS="|" read CATEGORY SUBPATH NAME COMPONENT_NAME <<< "$ITEM"
  if [[ "$CATEGORY" == "public" && "$NAME" == "Landing" ]]; then
    echo "      <Route path=\"/pub/lnd\" element={<${COMPONENT_NAME} />} />" >> "$OUT_ROUTES"
  fi
done

# Short-code routes
for ITEM in "${COMPONENTS[@]}"; do
  IFS="|" read CATEGORY SUBPATH NAME COMPONENT_NAME <<< "$ITEM"

  CAT_CODE=$(cat_code_for "$CATEGORY")
  FILE_CODE=$(file_code_for "$NAME")

  if [[ "$SUBPATH" == "." ]]; then
    ROUTE="/${CAT_CODE}/${FILE_CODE}"
  else
    FOLDER_CODE=$(folder_code_for "$SUBPATH")
    ROUTE="/${CAT_CODE}/${FOLDER_CODE}/${FILE_CODE}"
  fi

  echo "      <Route path=\"${ROUTE}\" element={<${COMPONENT_NAME} />} />" >> "$OUT_ROUTES"
done

cat >> "$OUT_ROUTES" << 'EOF'
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}
EOF

echo "🎉 Platform generation complete with role-based landing + refined labels"

