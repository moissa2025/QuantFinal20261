export default function Compliance() {
  return (
    <div className="compliance-container">

      {/* HEADER */}
      <div className="compliance-header">
        <h1>SLA & Compliance Dashboard</h1>
        <p>Operational guarantees, certifications, and regulatory posture.</p>
      </div>

      {/* SLA OVERVIEW */}
      <div className="compliance-panel">
        <h2>Service Level Agreements</h2>

        <div className="sla-row">
          <div className="sla-card">
            <h3>Uptime Guarantee</h3>
            <div className="metric positive">99.98%</div>
            <p className="sla-meta">Rolling 12‑month period</p>
          </div>

          <div className="sla-card">
            <h3>RTO</h3>
            <div className="metric">5 minutes</div>
            <p className="sla-meta">Recovery Time Objective</p>
          </div>

          <div className="sla-card">
            <h3>RPO</h3>
            <div className="metric">0 seconds</div>
            <p className="sla-meta">Recovery Point Objective</p>
          </div>

          <div className="sla-card">
            <h3>Support Response</h3>
            <div className="metric">15 minutes</div>
            <p className="sla-meta">Critical incidents</p>
          </div>
        </div>
      </div>

      {/* CERTIFICATIONS */}
      <div className="compliance-panel">
        <h2>Certifications</h2>

        <ul className="cert-list">
          <li>
            <strong>SOC 2 Type II</strong> — Certified  
            <span className="cert-meta">Valid until: 2027‑01‑01</span>
          </li>

          <li>
            <strong>ISO 27001</strong> — Certified  
            <span className="cert-meta">Valid until: 2026‑12‑15</span>
          </li>

          <li>
            <strong>GDPR Compliance</strong> — Active  
            <span className="cert-meta">EU Data Residency Supported</span>
          </li>

          <li>
            <strong>PCI DSS (Read‑Only)</strong> — Not Applicable  
            <span className="cert-meta">No cardholder data processed</span>
          </li>
        </ul>
      </div>

      {/* DATA SECURITY */}
      <div className="compliance-panel">
        <h2>Data Security</h2>

        <table className="compliance-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Encryption at Rest</td>
              <td className="positive">Enabled</td>
              <td>AES‑256</td>
            </tr>

            <tr>
              <td>Encryption in Transit</td>
              <td className="positive">Enabled</td>
              <td>TLS 1.3</td>
            </tr>

            <tr>
              <td>Data Residency</td>
              <td className="positive">Compliant</td>
              <td>EU, UK, US regions</td>
            </tr>

            <tr>
              <td>Access Logging</td>
              <td className="positive">Enabled</td>
              <td>Full audit trail</td>
            </tr>

            <tr>
              <td>Key Rotation</td>
              <td className="warning">Due Soon</td>
              <td>Next rotation: 2026‑04‑01</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* COMPLIANCE DOCUMENTS */}
      <div className="compliance-panel">
        <h2>Compliance Documents</h2>

        <ul className="doc-list">
          <li>SOC 2 Report — <button className="compliance-btn small">View</button></li>
          <li>ISO 27001 Certificate — <button className="compliance-btn small">View</button></li>
          <li>Data Processing Addendum — <button className="compliance-btn small">View</button></li>
          <li>Incident Response Policy — <button className="compliance-btn small">View</button></li>
        </ul>
      </div>

      {/* AUDIT LOG */}
      <div className="compliance-panel">
        <h2>Compliance Audit Log</h2>

        <ul className="audit-list">
          <li>
            <strong>2026‑03‑23 21:10</strong> — Completed quarterly SOC 2 control review  
          </li>
          <li>
            <strong>2026‑03‑20 14:44</strong> — Updated encryption policy  
          </li>
          <li>
            <strong>2026‑03‑18 09:12</strong> — Added new EU data residency region  
          </li>
        </ul>
      </div>

    </div>
  );
}

