// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useMemo } from "react";
import { ROLES } from "../config/roles";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // TODO: hydrate from real auth backend
  const [user, setUser] = useState({
    id: "demo-user",
    name: "Demo User",
    role: ROLES.ADMIN, // change to test: TRADER, CLIENT, SUPPORT, PUBLIC
  });

  const value = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// Role-based landing mapping
export function getLandingPathForRole(role) {
  switch (role) {
    case ROLES.ADMIN:
      return "/adm/dash";   // Admin → Dashboard
    case ROLES.TRADER:
      return "/app/mkt";    // Trader → Market
    case ROLES.CLIENT:
      return "/app/pfl";    // Client → Portfolio
    case ROLES.SUPPORT:
      return "/adm/usr";    // Support → Users
    case ROLES.PUBLIC:
    default:
      return "/pub/lnd";    // Public → Home
  }
}
