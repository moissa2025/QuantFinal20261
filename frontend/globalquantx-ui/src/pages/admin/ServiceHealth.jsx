import React from "react";

export default function ServiceHealth() {
  return (
    <div className="page page-admin page-servicehealth">
      <div className="page-header">
        <h1>Service Health</h1>
        <p>Live status of backend microservices.</p>
      </div>
      <div className="page-body">
        <p>This dashboard displays the health, latency, and availability of all backend services in the GlobalQuantX platform.</p>
      </div>
    </div>
  );
}
