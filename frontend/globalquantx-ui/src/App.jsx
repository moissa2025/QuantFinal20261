import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// New OS‑level layout
import Layout from "./layout/Layout";

// Public pages
import Landing from "./pages/public/Landing";
import Login from "./pages/public/Login";
import Support from "./pages/public/Support";
import LegalPrivacy from "./pages/public/LegalPrivacy";
import LegalTerms from "./pages/public/LegalTerms";
import LegalRisk from "./pages/public/LegalRisk";

// App pages (authenticated)
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

// Super‑modules
import GlobalCommandCenter from "./pages/admin/GlobalCommandCenter";
import StrategySuperLab from "./pages/admin/StrategySuperLab";
import ExecutionSuperConsole from "./pages/admin/ExecutionSuperConsole";
import MacroMicroFusionBoard from "./pages/admin/MacroMicroFusionBoard";
import LiqVolObservatory from "./pages/admin/LiqVolObservatory";

// Advanced modules (DE → DJ)
import RegimeAtlas from "./pages/admin/RegimeAtlas";
import AlphaDecaySurface from "./pages/admin/AlphaDecaySurface";
import ExecutionScenarioLab from "./pages/admin/ExecutionScenarioLab";
import StrategyDrift from "./pages/admin/StrategyDrift";
import VolInteraction from "./pages/admin/VolInteraction";
import LiquidityFracture from "./pages/admin/LiquidityFracture";

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
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/portfolio"
          element={
            <ProtectedRoute>
              <Layout>
                <Portfolio />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/trading"
          element={
            <ProtectedRoute>
              <Layout>
                <Trading />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/market"
          element={
            <ProtectedRoute>
              <Layout>
                <Market />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/ledger"
          element={
            <ProtectedRoute>
              <Layout>
                <Ledger />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/positions"
          element={
            <ProtectedRoute>
              <Layout>
                <Positions />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <Layout>
                <AdminUsers />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/risk"
          element={
            <AdminRoute>
              <Layout>
                <AdminRisk />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/ledger"
          element={
            <AdminRoute>
              <Layout>
                <AdminLedger />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/system"
          element={
            <AdminRoute>
              <Layout>
                <AdminSystem />
              </Layout>
            </AdminRoute>
          }
        />

        {/* SUPER‑MODULES */}
        <Route
          path="/admin/global-command-center"
          element={
            <AdminRoute>
              <Layout>
                <GlobalCommandCenter />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/strategy-superlab"
          element={
            <AdminRoute>
              <Layout>
                <StrategySuperLab />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/execution-superconsole"
          element={
            <AdminRoute>
              <Layout>
                <ExecutionSuperConsole />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/macro-micro-fusion"
          element={
            <AdminRoute>
              <Layout>
                <MacroMicroFusionBoard />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/liqvol-observatory"
          element={
            <AdminRoute>
              <Layout>
                <LiqVolObservatory />
              </Layout>
            </AdminRoute>
          }
        />

        {/* ADVANCED MODULES (DE → DJ) */}
        <Route
          path="/admin/regime-atlas"
          element={
            <AdminRoute>
              <Layout>
                <RegimeAtlas />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/alpha-decay"
          element={
            <AdminRoute>
              <Layout>
                <AlphaDecaySurface />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/execution-scenario"
          element={
            <AdminRoute>
              <Layout>
                <ExecutionScenarioLab />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/strategy-drift"
          element={
            <AdminRoute>
              <Layout>
                <StrategyDrift />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/vol-interaction"
          element={
            <AdminRoute>
              <Layout>
                <VolInteraction />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/admin/liquidity-fracture"
          element={
            <AdminRoute>
              <Layout>
                <LiquidityFracture />
              </Layout>
            </AdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

