import React from "react";
import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import Layout from "./layout/Layout.jsx";
import GeneratedRoutes from "./layout/GeneratedRoutes.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <GeneratedRoutes />
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

