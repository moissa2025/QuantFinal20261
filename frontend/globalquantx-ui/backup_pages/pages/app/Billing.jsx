import DockablePanel from "../../layout/DockablePanel.jsx";
export default function Billing() {
  return (
    <div className="billing-container">

      {/* HEADER */}
      <div className="billing-header">
        <h1>Billing</h1>
        <p>Manage your subscription, invoices, and payment methods.</p>


      {/* PLAN SUMMARY */}
      <div className="billing-panel">
        <h2>Current Plan</h2>

        <div className="billing-row">
          <div className="billing-plan">
            <h3>Professional</h3>
            <p>$99 / month</p>
            <p className="billing-meta">Includes API access, trading, and analytics.</p>


          <button className="billing-btn">Upgrade Plan</button>



      {/* USAGE */}
      <div className="billing-panel">
        <h2>Usage</h2>

        <ul className="usage-list">
          <li>
            API Requests (month): <strong>42,120</strong>
            <span className="usage-meta">Limit: 100,000</span>
          </li>

          <li>
            WebSocket Connections: <strong>3</strong>
            <span className="usage-meta">Limit: 10</span>
          </li>

          <li>
            Historical Data Queries: <strong>1,240</strong>
            <span className="usage-meta">Limit: 5,000</span>
          </li>
        </ul>


      {/* PAYMENT METHOD */}
      <div className="billing-panel">
        <h2>Payment Method</h2>

        <div className="billing-row">
          <div className="payment-card">
            <p><strong>Visa •••• 4242</strong></p>
            <p>Expires 08/28</p>


          <button className="billing-btn">Update Card</button>



      {/* INVOICES */}
      <div className="billing-panel">
        <h2>Invoices</h2>

        <table className="billing-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Invoice ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Download</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>2026‑03‑01</td>
              <td>INV‑20260301‑001</td>
              <td>$99.00</td>
              <td className="positive">Paid</td>
              <td><button className="billing-btn small">PDF</button></td>
            </tr>

            <tr>
              <td>2026‑02‑01</td>
              <td>INV‑20260201‑001</td>
              <td>$99.00</td>
              <td className="positive">Paid</td>
              <td><button className="billing-btn small">PDF</button></td>
            </tr>

            <tr>
              <td>2026‑01‑01</td>
              <td>INV‑20260101‑001</td>
              <td>$99.00</td>
              <td className="positive">Paid</td>
              <td><button className="billing-btn small">PDF</button></td>
            </tr>
          </tbody>
        </table>



</DockablePanel>
  );
}

