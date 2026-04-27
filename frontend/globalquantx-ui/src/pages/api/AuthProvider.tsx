// pages/api/AuthProvider.tsx
import React, { createContext, useEffect, useState } from "react";
import { loadTokens, validateSession, refresh, clearTokens } from "./authClient";

export const AuthContext = createContext({
  loading: true,
  authenticated: false,
  user: null as any,
  refreshSession: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  async function refreshSession() {
    try {
      const res = await validateSession();
      if (res.valid) {
        setAuthenticated(true);
        setUser(res.user || null);
        return;
      }
      // Try refresh token
      const refreshed = await refresh();
      if (refreshed) {
        const v = await validateSession();
        if (v.valid) {
          setAuthenticated(true);
          setUser(v.user || null);
          return;
        }
      }
      setAuthenticated(false);
      setUser(null);
    } catch {
      setAuthenticated(false);
      setUser(null);
    }
  }

  async function logoutUser() {
    clearTokens();
    setAuthenticated(false);
    setUser(null);
    window.location.href = "/public/login";
  }

  useEffect(() => {
    loadTokens();
    (async () => {
      await refreshSession();
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        authenticated,
        user,
        refreshSession,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

