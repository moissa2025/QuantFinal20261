import React from "react";

const Page = ({ title, subtitle, children }) => {
  return (
    <div className="card" style={{ marginBottom: "16px" }}>
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          {subtitle && <div className="card-sub">{subtitle}</div>}
        </div>
      </div>
      <div style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--muted)" }}>{children}</div>
    </div>
  );
};

export default Page;

