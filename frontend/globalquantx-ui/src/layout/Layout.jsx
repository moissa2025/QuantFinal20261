// src/layout/Layout.jsx
import React from "react";
import AppShell from "./AppShell.jsx";

export default function Layout({ children }) {
  return (
    <AppShell>
      <div className="app-content">
        {children}
      </div>
    </AppShell>
  );
}

