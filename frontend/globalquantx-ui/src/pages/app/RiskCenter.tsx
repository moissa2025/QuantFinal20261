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
