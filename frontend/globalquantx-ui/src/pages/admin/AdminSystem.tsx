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
