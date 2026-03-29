#!/bin/bash
set -e

ROOT="../src"
PAGES_DIR="$ROOT/pages"

mkdir -p "$PAGES_DIR/app" "$PAGES_DIR/admin"

echo "🧭 Generating Control Center pages (Dashboard, Ledger, Risk, System, Users)..."

################################
# Dashboard (Ops Overview)
################################
cat > "$PAGES_DIR/app/Dashboard.jsx" <<'EOF'
import React, { useEffect, useState } from "react";
import { SystemHealth, UserSummary, RiskExposure } from "../../services/dtos";
import { mockFetch } from "../../services/mockFetch";

export default function Dashboard() {
  const [health, setHealth] = useState<SystemHealth[]>([]);
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [risk, setRisk] = useState<RiskExposure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [h, u, r] = await Promise.all([
          mockFetch("/system/health"),
          mockFetch("/auth/users/summary"),
          mockFetch("/risk/exposures/summary"),
        ]);
        setHealth(h);
        setUsers(u);
        setRisk(r);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="page page-app page-dashboard">
      <div className="page-header">
        <h1>Operations Dashboard</h1>
        <p>Real-time overview of platform health, users, and risk.</p>
      </div>
      <div className="page-body grid grid-3">
        <section className="card">
          <h2>Service Health</h2>
          {loading && <div>Loading...</div>}
          {!loading && (
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Latency (ms)</th>
                </tr>
              </thead>
              <tbody>
                {health.map((s) => (
                  <tr key={s.service}>
                    <td>{s.service}</td>
                    <td>{s.status}</td>
                    <td>{s.latencyMs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="card">
          <h2>Active Users</h2>
          {loading && <div>Loading...</div>}
          {!loading && (
            <ul>
              {users.map((u) => (
                <li key={u.id}>
                  {u.email} — {u.role} ({u.status})
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <h2>Risk Snapshot</h2>
          {loading && <div>Loading...</div>}
          {!loading && (
            <ul>
              {risk.map((e) => (
                <li key={e.id}>
                  {e.book} / {e.symbol}: Δ {e.delta} ({e.currency})
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
EOF

################################
# Ledger (Financial Backbone)
################################
cat > "$PAGES_DIR/app/Ledger.jsx" <<'EOF'
import React, { useEffect, useState } from "react";
import { LedgerEntry } from "../../services/dtos";
import { mockFetch } from "../../services/mockFetch";

export default function Ledger() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await mockFetch("/ledger/journal");
        setEntries(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="page page-app page-ledger">
      <div className="page-header">
        <h1>Ledger</h1>
        <p>Journal entries and account movements.</p>
      </div>
      <div className="page-body">
        {loading && <div>Loading journal...</div>}
        {!loading && (
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Direction</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td>{e.bookedAt}</td>
                  <td>{e.accountId}</td>
                  <td>{e.amount}</td>
                  <td>{e.currency}</td>
                  <td>{e.direction}</td>
                  <td>{e.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
EOF

################################
# Risk Center (Risk Oversight)
################################
cat > "$PAGES_DIR/app/RiskCenter.jsx" <<'EOF'
import React, { useEffect, useState } from "react";
import { RiskExposure } from "../../services/dtos";
import { mockFetch } from "../../services/mockFetch";

export default function RiskCenter() {
  const [exposures, setExposures] = useState<RiskExposure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await mockFetch("/risk/exposures");
        setExposures(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="page page-app page-risk-center">
      <div className="page-header">
        <h1>Risk Center</h1>
        <p>Real-time exposures and limit monitoring.</p>
      </div>
      <div className="page-body">
        {loading && <div>Loading exposures...</div>}
        {!loading && (
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Symbol</th>
                <th>Delta</th>
                <th>Currency</th>
              </tr>
            </thead>
            <tbody>
              {exposures.map((e) => (
                <tr key={e.id}>
                  <td>{e.book}</td>
                  <td>{e.symbol}</td>
                  <td>{e.delta}</td>
                  <td>{e.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
EOF

################################
# System (Platform Integrity)
################################
cat > "$PAGES_DIR/admin/AdminSystem.jsx" <<'EOF'
import React, { useEffect, useState } from "react";
import { SystemHealth } from "../../services/dtos";
import { mockFetch } from "../../services/mockFetch";

export default function AdminSystem() {
  const [health, setHealth] = useState<SystemHealth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await mockFetch("/system/health");
        setHealth(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="page page-admin page-admin-system">
      <div className="page-header">
        <h1>System Health</h1>
        <p>Technical status of all backend services.</p>
      </div>
      <div className="page-body">
        {loading && <div>Loading system health...</div>}
        {!loading && (
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>Latency (ms)</th>
                <th>Last Check</th>
              </tr>
            </thead>
            <tbody>
              {health.map((s) => (
                <tr key={s.service}>
                  <td>{s.service}</td>
                  <td>{s.status}</td>
                  <td>{s.latencyMs}</td>
                  <td>{s.lastCheck}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
EOF

################################
# Users (Identity & Governance)
################################
cat > "$PAGES_DIR/admin/AdminUsers.jsx" <<'EOF'
import React, { useEffect, useState } from "react";
import { UserSummary } from "../../services/dtos";
import { mockFetch } from "../../services/mockFetch";

export default function AdminUsers() {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await mockFetch("/auth/users/summary");
        setUsers(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="page page-admin page-admin-users">
      <div className="page-header">
        <h1>Users & Access</h1>
        <p>Identity, roles, and governance.</p>
      </div>
      <div className="page-body">
        {loading && <div>Loading users...</div>}
        {!loading && (
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
EOF

echo "✨ Control Center pages generated."

