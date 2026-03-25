// src/layout/Layout.jsx

import React from "react";
import AppShell from "./AppShell.jsx";

export default function Layout({ children }) {
  return <AppShell>{children}</AppShell>;
}
