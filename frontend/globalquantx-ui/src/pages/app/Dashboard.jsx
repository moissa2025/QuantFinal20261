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
