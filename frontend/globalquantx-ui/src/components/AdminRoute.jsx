import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AppShell from "./layout/AppShell";

export default function AdminRoute({ children }) {
  const { token, user } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" replace />;

  if (!user?.role || user.role !== "admin") {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <AppShell>{children}</AppShell>;
}

