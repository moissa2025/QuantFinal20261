import React from "react";

export default function PublicRiskDisclosure() {
  return (
    <main className="-public-risk-disclosure">

      <h1>Risk Disclosure</h1>
      <p>
        Trading in financial instruments involves risk, including the possible
        loss of principal. GlobalQuantX is an institutional platform and does
        not provide investment advice.
      </p>
    
      <footer className="global-footer">
        <p>
          Alerts: <a href="mailto:alerts@globalquantx.com">alerts@globalquantx.com</a> |
          {" "}Trading Desk: <a href="mailto:trading@globalquantx.com">trading@globalquantx.com</a> |
          {" "}Support: <a href="mailto:support@globalquantx.com">support@globalquantx.com</a>
        </p>

      </footer>
    </main>
  );
}
