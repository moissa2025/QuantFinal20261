// pages/api/ProtectedRoute.tsx
import React, { useContext, useEffect } from "react";
import { AuthContext } from "./AuthProvider";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, authenticated } = useContext(AuthContext);

  useEffect(() => {
    if (!loading && !authenticated) {
      window.location.href = "/public/login";
    }
  }, [loading, authenticated]);

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Validating session...
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}

