// src/components/ProtectedRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import AppShell from "./layout/AppShell";

export default function ProtectedRoute({ children }) {
  const { auth, loading } = useAuth();

  if (loading) return null;

  if (!auth) {
    return <Navigate to="/public/login" replace />;
  }

  return <AppShell>{children}</AppShell>;
}

