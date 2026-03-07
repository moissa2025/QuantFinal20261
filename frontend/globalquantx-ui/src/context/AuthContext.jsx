import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  //
  // 1. Decode token + check expiry
  //
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;

      if (Date.now() >= exp) {
        handleLogout(true);
        return;
      }

      setUser(payload);
    } catch (err) {
      console.error("Invalid token:", err);
      handleLogout(true);
    }
  }, [token]);

  //
  // 2. Login handler
  //
  function handleLogin(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setSessionExpired(false);
  }

  //
  // 3. Logout handler
  //
  function handleLogout(expired = false) {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);

    if (expired) {
      setSessionExpired(true);
    }
  }

  //
  // 4. Refresh token (only works if backend supports refresh tokens)
  //
  async function refreshToken() {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();
      handleLogin(data.token);
    } catch (err) {
      console.error("Refresh token error:", err);
      handleLogout(true);
    }
  }

  //
  // 5. Auto-refresh scheduling
  //
  useEffect(() => {
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000;

      // Refresh 1 minute before expiry
      const refreshAt = exp - 60_000;
      const delay = refreshAt - Date.now();

      if (delay <= 0) {
        refreshToken();
        return;
      }

      const id = setTimeout(refreshToken, delay);
      return () => clearTimeout(id);
    } catch {
      handleLogout(true);
    }
  }, [token]);

  //
  // 6. Provide context
  //
  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        sessionExpired,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

