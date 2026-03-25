#!/bin/bash
set -e

echo "🚀 GlobalQuantX UI Integration Generator"
echo "----------------------------------------"

ROOT="src"

# Ensure required directories exist
mkdir -p $ROOT/api
mkdir -p $ROOT/context
mkdir -p $ROOT/pages/app

FORCE="$1"

write_file() {
  local path="$1"
  local content="$2"

  if [[ -f "$path" && "$FORCE" != "--force" ]]; then
    echo "⚠️  $path already exists. Use --force to overwrite."
    return
  fi

  echo "$content" > "$path"
  echo "✅ Created: $path"
}

# -----------------------------------------
# 1. httpClient.js
# -----------------------------------------
write_file "$ROOT/api/httpClient.js" \
'const API_BASE = "https://api.globalquantx.com";

let sessionToken = null;

export function setSessionToken(token) {
  sessionToken = token;
}

export async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (sessionToken) {
    headers["Authorization"] = `Session ${sessionToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("unauthorized");
  }

  return res;
}
'

# -----------------------------------------
# 2. authClient.js
# -----------------------------------------
write_file "$ROOT/api/authClient.js" \
'import { apiFetch, setSessionToken } from "./httpClient";

const STORAGE_KEY = "gqx_auth";

function saveAuth(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  setSessionToken(data.session_token);
}

export function loadAuth() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    setSessionToken(parsed.session_token);
    return parsed;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
  setSessionToken(null);
}

export async function login(email, password) {
  const res = await apiFetch("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      user_agent: navigator.userAgent,
      ip_address: null,
    }),
  });

  if (!res.ok) throw new Error("login_failed");
  const data = await res.json();

  const auth = {
    user_id: data.user_id,
    session_token: data.session_token,
    roles: data.roles || [],
    refresh_token: data.refresh_token || null,
    ttl_seconds: data.ttl_seconds,
  };

  saveAuth(auth);
  return auth;
}

export async function validateSession(session_token) {
  const res = await apiFetch("/v1/auth/validate", {
    method: "POST",
    body: JSON.stringify({ token: session_token }),
  });

  if (!res.ok) throw new Error("validate_failed");
  return res.json();
}

export async function refreshSession(refresh_token) {
  const res = await apiFetch("/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token }),
  });

  if (!res.ok) throw new Error("refresh_failed");
  const data = await res.json();

  const auth = {
    user_id: data.user_id,
    session_token: data.session_token,
    roles: [],
    refresh_token: data.refresh_token,
    ttl_seconds: data.ttl_seconds,
  };

  saveAuth(auth);
  return auth;
}

export async function logout(session_token) {
  try {
    await apiFetch("/v1/auth/logout", {
      method: "POST",
      body: JSON.stringify({ token: session_token }),
    });
  } catch {}
  clearAuth();
}
'

# -----------------------------------------
# 3. AuthContext.jsx
# -----------------------------------------
write_file "$ROOT/context/AuthContext.jsx" \
'// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ROLES } from "../config/roles";
import {
  loadAuth,
  login as apiLogin,
  logout as apiLogout,
  validateSession,
  refreshSession,
  clearAuth,
} from "../api/authClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuth());
  const [user, setUser] = useState(() => ({
    id: auth?.user_id || null,
    name: "Unknown",
    role: auth?.roles?.[0] || ROLES.PUBLIC,
  }));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!auth?.session_token) {
        setLoading(false);
        return;
      }

      try {
        const res = await validateSession(auth.session_token);
        if (!res.valid) {
          clearAuth();
          if (!cancelled) {
            setAuth(null);
            setUser({ id: null, name: "Guest", role: ROLES.PUBLIC });
          }
          return;
        }

        if (!cancelled) {
          setUser({
            id: res.user_id,
            name: res.email || "User",
            role: (res.roles && res.roles[0]) || ROLES.CLIENT,
          });
        }
      } catch {
        clearAuth();
        if (!cancelled) {
          setAuth(null);
          setUser({ id: null, name: "Guest", role: ROLES.PUBLIC });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [auth?.session_token]);

  const value = useMemo(
    () => ({
      user,
      auth,
      loading,
      async login(email, password) {
        const a = await apiLogin(email, password);
        setAuth(a);
        setUser({
          id: a.user_id,
          name: email,
          role: a.roles?.[0] || ROLES.CLIENT,
        });
      },
      async logout() {
        if (auth?.session_token) {
          await apiLogout(auth.session_token);
        }
        setAuth(null);
        setUser({ id: null, name: "Guest", role: ROLES.PUBLIC });
      },
      async refresh() {
        if (!auth?.refresh_token) return;
        const a = await refreshSession(auth.refresh_token);
        setAuth(a);
      },
    }),
    [user, auth, loading]
  );

  if (loading) {
    return <div style={{ padding: 24 }}>Restoring session…</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getLandingPathForRole(role) {
  switch (role) {
    case ROLES.ADMIN:
      return "/adm/dash";
    case ROLES.TRADER:
      return "/app/mkt";
    case ROLES.CLIENT:
      return "/app/pfl";
    case ROLES.SUPPORT:
      return "/adm/usr";
    case ROLES.PUBLIC:
    default:
      return "/pub/lnd";
  }
}
'

# -----------------------------------------
# 4. MarketDataContext.jsx
# -----------------------------------------
write_file "$ROOT/context/MarketDataContext.jsx" \
'import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const MarketDataContext = createContext(null);

const WS_URL = "wss://api.globalquantx.com/market-data/stream";
const SNAPSHOT_URL = "https://api.globalquantx.com/market-data/snapshot";

export function MarketDataProvider({ children }) {
  const [rows, setRows] = useState([]);
  const [bySymbol, setBySymbol] = useState({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSnapshot() {
      try {
        const res = await fetch(SNAPSHOT_URL);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setRows(data);
        setBySymbol(
          data.reduce((acc, row) => {
            acc[row.symbol] = row;
            return acc;
          }, {})
        );
      } catch {}
    }

    loadSnapshot();

    let ws;
    function connect() {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        if (!cancelled) setConnected(true);
      };

      ws.onmessage = (event) => {
        if (cancelled) return;
        try {
          const snapshot = JSON.parse(event.data);
          setRows(snapshot);
          setBySymbol(
            snapshot.reduce((acc, row) => {
              acc[row.symbol] = row;
              return acc;
            }, {})
          );
        } catch {}
      };

      ws.onclose = () => {
        if (!cancelled) setConnected(false);
        setTimeout(() => {
          if (!cancelled) connect();
        }, 2000);
      };
    }

    connect();

    return () => {
      cancelled = true;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      rows,
      bySymbol,
      connected,
    }),
    [rows, bySymbol, connected]
  );

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  const ctx = useContext(MarketDataContext);
  if (!ctx) throw new Error("useMarketData must be used within MarketDataProvider");
  return ctx;
}
'

# -----------------------------------------
# 5. Market.jsx (Bloomberg-style)
# -----------------------------------------
write_file "$ROOT/pages/app/Market.jsx" \
'import React from "react";
import { useMarketData } from "../../context/MarketDataContext";

export default function AppMarket() {
  const { rows, connected } = useMarketData();

  return (
    <div>
      <h1>Market</h1>
      <div style={{ fontSize: 12, marginBottom: 8 }}>
        Feed: {connected ? "LIVE" : "DISCONNECTED"}
      </div>
      <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Symbol</th>
            <th align="left">Name</th>
            <th align="right">Price</th>
            <th align="right">Change %</th>
            <th align="right">Volume</th>
            <th align="right">MCap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const color =
              row.change_pct > 0 ? "#22c55e" : row.change_pct < 0 ? "#ef4444" : "#e5e7eb";
            return (
              <tr key={row.symbol}>
                <td>{row.symbol}</td>
                <td>{row.name}</td>
                <td align="right">{row.price.toFixed(2)}</td>
                <td align="right" style={{ color }}>
                  {row.change_pct.toFixed(2)}%
                </td>
                <td align="right">{row.volume}</td>
                <td align="right">{row.mcap}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
'

echo "----------------------------------------"
echo "🎉 All core integration files generated!"
echo "Run with --force to overwrite existing files."

