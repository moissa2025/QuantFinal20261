// AUTO-GENERATED CLEAN ROUTER
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, getLandingPathForRole } from "../context/AuthContext.jsx";

import Landing from "../pages/Landing.jsx";\nimport Portfolio from "../pages/app/Portfolio.jsx";\nimport RiskCenter from "../pages/app/RiskCenter.jsx";\nimport Market from "../pages/app/Market.jsx";\nimport Ledger from "../pages/app/Ledger.jsx";\nimport Support from "../pages/app/Support.jsx";\nimport Dashboard from "../pages/app/Dashboard.jsx";\nimport Trading from "../pages/app/Trading.jsx";\nimport OrderEntry from "../pages/app/OrderEntry.jsx";\nimport Positions from "../pages/app/Positions.jsx";\nimport AdminUsers from "../pages/admin/AdminUsers.jsx";\nimport RiskCenter from "../pages/admin/RiskCenter.jsx";\nimport AlphaDecay from "../pages/admin/AlphaDecay.jsx";\nimport LiquidityMap from "../pages/admin/LiquidityMap.jsx";\nimport ExecutionReplay from "../pages/admin/ExecutionReplay.jsx";\nimport AdminSystem from "../pages/admin/AdminSystem.jsx";\nimport Landing from "../pages/public/Landing.jsx";\nimport RiskDisclosure from "../pages/public/RiskDisclosure.jsx";\nimport LegalTerms from "../pages/public/LegalTerms.jsx";\nimport Support from "../pages/public/Support.jsx";\nimport Login from "../pages/public/Login.jsx";\nimport LegalPrivacy from "../pages/public/LegalPrivacy.jsx";\n

function RoleLandingRedirect() {
  const { user } = useAuth();
  return <Navigate to={getLandingPathForRole(user.role)} replace />;
}

export default function GeneratedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleLandingRedirect />} />
  <Route path="/pub/lnd" element={<Landing />} />\n  <Route path="/app/pfl" element={<Portfolio />} />\n  <Route path="/app/rsk" element={<RiskCenter />} />\n  <Route path="/app/mkt" element={<Market />} />\n  <Route path="/app/led" element={<Ledger />} />\n  <Route path="/pub/sup" element={<Support />} />\n  <Route path="/app/dash" element={<Dashboard />} />\n  <Route path="/app/trd" element={<Trading />} />\n  <Route path="/app/ord" element={<OrderEntry />} />\n  <Route path="/app/pos" element={<Positions />} />\n  <Route path="/adm/usr" element={<AdminUsers />} />\n  <Route path="/app/rsk" element={<RiskCenter />} />\n  <Route path="/adm/dec" element={<AlphaDecay />} />\n  <Route path="/adm/map" element={<LiquidityMap />} />\n  <Route path="/adm/rep" element={<ExecutionReplay />} />\n  <Route path="/adm/sys" element={<AdminSystem />} />\n  <Route path="/pub/lnd" element={<Landing />} />\n  <Route path="/pub/ris" element={<RiskDisclosure />} />\n  <Route path="/pub/ter" element={<LegalTerms />} />\n  <Route path="/pub/sup" element={<Support />} />\n  <Route path="/pub/lgn" element={<Login />} />\n  <Route path="/pub/lpr" element={<LegalPrivacy />} />\n
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}
