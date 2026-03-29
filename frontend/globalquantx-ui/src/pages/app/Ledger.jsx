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
