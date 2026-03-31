import React from "react";
import { AuthProvider } from "./context/AuthContext.jsx";
import GeneratedRoutes from "./layout/GeneratedRoutes.jsx";

export default function App() {
  return (
    <AuthProvider>
      <GeneratedRoutes />
    </AuthProvider>
  );
}

