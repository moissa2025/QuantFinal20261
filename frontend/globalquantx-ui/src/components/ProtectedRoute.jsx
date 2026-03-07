import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AppShell from "./layout/AppShell";

export default function ProtectedRoute({ children }) {
  const { token, sessionExpired } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (sessionExpired) {
    return <Navigate to="/login?expired=1" replace />;
  }

  return <AppShell>{children}</AppShell>;
}

