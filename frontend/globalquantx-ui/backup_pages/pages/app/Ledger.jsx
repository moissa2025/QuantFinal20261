import DockablePanel from "../../layout/DockablePanel.jsx";
export default function Ledger() {
  return (
    <div className="ledger-container">

      {/* TOP SUMMARY */}
      <div className="ledger-row">
        <div className="ledger-card">
          <h3>Total Transactions</h3>
          <div className="metric">482</div>


        <div className="ledger-card">
          <h3>Credits</h3>
          <div className="metric positive">$1,248,920</div>


        <div className="ledger-card">
          <h3>Debits</h3>
          <div className="metric negative">$1,197,810</div>


        <div className="ledger-card">
          <h3>Net Flow</h3>
          <div className="metric positive">+ $51,110</div>



      {/* LEDGER TABLE */}
      <div className="ledger-table">
        <h3>Transaction Ledger</h3>

        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Type</th>
              <th>Asset</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>Reference</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>2026‑03‑23 14:21:10</td>
              <td className="positive">Credit</td>
              <td>BTC/USD</td>
              <td className="positive">+ 0.50</td>
              <td>$1,248,920</td>
              <td>Order #98213</td>
            </tr>

            <tr>
              <td>2026‑03‑23 13:58:44</td>
              <td className="negative">Debit</td>
              <td>ETH/USD</td>
              <td className="negative">− 4.0</td>
              <td>$1,236,900</td>
              <td>Order #98212</td>
            </tr>

            <tr>
              <td>2026‑03‑23 12:11:03</td>
              <td className="positive">Credit</td>
              <td>AAPL</td>
              <td className="positive">+ 20</td>
              <td>$1,240,620</td>
              <td>Order #98211</td>
            </tr>
          </tbody>
        </table>


      {/* AUDIT TRAIL */}
      <div className="ledger-panel">
        <h3>Audit Trail</h3>

        <ul className="audit-list">
          <li>2026‑03‑23 14:21:10 — Order #98213 executed at 68,200</li>
          <li>2026‑03‑23 13:58:44 — Order #98212 executed at 3,420</li>
          <li>2026‑03‑23 12:11:03 — Order #98211 executed at 187.40</li>
          <li>2026‑03‑23 11:50:22 — Risk check passed for BTCUSD order</li>
          <li>2026‑03‑23 11:49:10 — User login successful</li>
        </ul>



</DockablePanel>
  );
}

