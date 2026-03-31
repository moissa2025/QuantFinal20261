import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load session from localStorage on startup
  useEffect(() => {
    const stored = localStorage.getItem("gqx_auth");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Login function
  const login = (authData) => {
    localStorage.setItem("gqx_auth", JSON.stringify(authData));
    setUser(authData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("gqx_auth");
    setUser(null);
    window.location.href = "/public/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

