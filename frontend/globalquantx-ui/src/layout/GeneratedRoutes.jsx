import Pricing from "../pages/marketing/Pricing.jsx";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// SHELLS
import Layout from "./Layout.jsx"; // OS Shell

// PUBLIC PAGES
import Login from "../pages/public/Login.tsx";
import Landing from "../pages/public/Landing.jsx";
import Support from "../pages/public/Support.jsx";
import Terms from "../pages/public/Terms.jsx";
import Privacy from "../pages/public/Privacy.jsx";
import RiskDisclosure from "../pages/public/RiskDisclosure.jsx";

// APP PAGES
import Dashboard from "../pages/app/Dashboard.jsx";
import Portfolio from "../pages/app/Portfolio.jsx";
import Market from "../pages/app/Market.jsx";
import Ledger from "../pages/app/Ledger.jsx";
import Positions from "../pages/app/Positions.jsx";
import Trading from "../pages/app/Trading.jsx";
import OrderEntry from "../pages/app/OrderEntry.jsx";
import RiskCenter from "../pages/app/RiskCenter.tsx";
import Settings from "../pages/app/Settings.jsx";
import Notifications from "../pages/app/Notifications.jsx";
import ApiDocs from "../pages/app/ApiDocs.jsx";
import ApiKeys from "../pages/app/ApiKeys.jsx";
import Branding from "../pages/app/Branding.jsx";
import Billing from "../pages/app/Billing.jsx";
import Webhooks from "../pages/app/Webhooks.jsx";
import DataExport from "../pages/app/DataExport.jsx";
import DeveloperPlayground from "../pages/app/DeveloperPlayground.jsx";
import NotificationTemplates from "../pages/app/NotificationTemplates.jsx";
import SystemStatus from "../pages/app/SystemStatus.jsx";
import UserActivity from "../pages/app/UserActivity.jsx";
import UserProfile2 from "../pages/app/UserProfile2.jsx";

// ADMIN PAGES
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AdminUsers from "../pages/admin/AdminUsers.tsx";
import AdminSystem from "../pages/admin/AdminSystem.tsx";
import AdminLedger from "../pages/admin/AdminLedger.jsx";
import AdminRisk from "../pages/admin/AdminRisk.jsx";
import FeatureFlags from "../pages/admin/FeatureFlags.jsx";
import LiquidityMap from "../pages/admin/LiquidityMap.jsx";
import ExecutionReplay from "../pages/admin/ExecutionReplay.jsx";
import AlphaDecay from "../pages/admin/AlphaDecay.jsx";
import PublicShell from "./PublicShell.jsx";


// AUTH GUARD
function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function GeneratedRoutes() {
  return (
    <Routes>

  <Route path="/login" element={<PublicShell><Login /></PublicShell>} />
  <Route path="/landing" element={<PublicShell><Landing /></PublicShell>} />
  <Route path="/pricing" element={<PublicShell><Pricing /></PublicShell>} />

  <Route path="/support" element={<PublicShell><Support /></PublicShell>} />
  <Route path="/terms" element={<PublicShell><Terms /></PublicShell>} />
  <Route path="/privacy" element={<PublicShell><Privacy /></PublicShell>} />
  <Route path="/risk" element={<PublicShell><RiskDisclosure /></PublicShell>} />
      {/* DEFAULT PUBLIC REDIRECT */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* AUTHENTICATED ROUTES — USE OS SHELL */}
      <Route
        path="/app/*"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="market" element={<Market />} />
        <Route path="ledger" element={<Ledger />} />
        <Route path="positions" element={<Positions />} />
        <Route path="trading" element={<Trading />} />
        <Route path="order-entry" element={<OrderEntry />} />
        <Route path="risk" element={<RiskCenter />} />
        <Route path="settings" element={<Settings />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="api-docs" element={<ApiDocs />} />
        <Route path="api-keys" element={<ApiKeys />} />
        <Route path="branding" element={<Branding />} />
        <Route path="billing" element={<Billing />} />
        <Route path="webhooks" element={<Webhooks />} />
        <Route path="export" element={<DataExport />} />
        <Route path="playground" element={<DeveloperPlayground />} />
        <Route path="templates" element={<NotificationTemplates />} />
        <Route path="status" element={<SystemStatus />} />
        <Route path="activity" element={<UserActivity />} />
        <Route path="profile" element={<UserProfile2 />} />
      </Route>

      {/* ADMIN ROUTES — ALSO USE OS SHELL */}
      <Route
        path="/admin/*"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="system" element={<AdminSystem />} />
        <Route path="ledger" element={<AdminLedger />} />
        <Route path="risk" element={<AdminRisk />} />
        <Route path="flags" element={<FeatureFlags />} />
        <Route path="liquidity-map" element={<LiquidityMap />} />
        <Route path="replay" element={<ExecutionReplay />} />
        <Route path="alpha-decay" element={<AlphaDecay />} />
      </Route>

      {/* CATCH-ALL */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

