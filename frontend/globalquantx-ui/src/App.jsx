import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Public pages
import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Support from "./pages/public/Support";
import LegalPrivacy from "./pages/public/LegalPrivacy";
import LegalTerms from "./pages/public/LegalTerms";
import LegalRisk from "./pages/public/LegalRisk";

// App pages
import Dashboard from "./pages/app/Dashboard";
import Portfolio from "./pages/app/Portfolio";
import Trading from "./pages/app/Trading";
import Market from "./pages/app/Market";
import Ledger from "./pages/app/Ledger";
import Positions from "./pages/app/Positions";
import Settings from "./pages/app/Settings";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRisk from "./pages/admin/AdminRisk";
import AdminLedger from "./pages/admin/AdminLedger";
import AdminSystem from "./pages/admin/AdminSystem";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/support" element={<Support />} />
        <Route path="/legal/privacy" element={<LegalPrivacy />} />
        <Route path="/legal/terms" element={<LegalTerms />} />
        <Route path="/legal/risk" element={<LegalRisk />} />

        {/* AUTHENTICATED ROUTES */}
        <Route
          path="/app/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/trading"
          element={
            <ProtectedRoute>
              <Trading />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/market"
          element={
            <ProtectedRoute>
              <Market />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/ledger"
          element={
            <ProtectedRoute>
              <Ledger />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/positions"
          element={
            <ProtectedRoute>
              <Positions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/risk"
          element={
            <AdminRoute>
              <AdminRisk />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/ledger"
          element={
            <AdminRoute>
              <AdminLedger />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/system"
          element={
            <AdminRoute>
              <AdminSystem />
            </AdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

