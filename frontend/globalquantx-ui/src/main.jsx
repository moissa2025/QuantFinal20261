// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/auth.css";
import App from "./App.jsx";

// 🔥 Unified OS Shell Layout (Sidebar + Topbar + WindowManager + Search + Palette)
import Layout from "./layout/Layout.jsx";
// 🌙 Global OS Shell Styles (institutional look)
import "./layout/os-shell.css";

// 🌍 Global base styles
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/navigation.css";
import "./styles/styles.css";

// 🌐 Core UI sections
import "./styles/landing.css";
import "./styles/dashboard.css";
import "./styles/trading.css";
import "./styles/portfolio.css";
import "./styles/market.css";
import "./styles/positions.css";
import "./styles/ledger.css";
import "./styles/settings.css";
import "./styles/admin.css";
import "./styles/support.css";
import "./styles/legal.css";
import "./styles/notifications.css";
import "./styles/audit.css";
import "./styles/api.css";
import "./styles/activity.css";
import "./styles/playground.css";
import "./styles/webhooks.css";
import "./styles/billing.css";
import "./styles/keys.css";
import "./styles/templates.css";
import "./styles/profile2.css";
import "./styles/export.css";
import "./styles/branding.css";
import "./styles/status.css";
import "./styles/impersonate.css";
import "./styles/tenant.css";
import "./styles/flags.css";
import "./styles/broadcast.css";
import "./styles/compliance.css";
import "./styles/tools.css";
import "./styles/regulatory.css";
import "./styles/dr.css";
import "./styles/obs.css";
import "./styles/risk.css";
import "./styles/liquidity.css";
import "./styles/capacity.css";
import "./styles/matching.css";
import "./styles/portfolioRisk.css";
import "./styles/executionQuality.css";
import "./styles/marketReplay.css";
import "./styles/correlation.css";
import "./styles/smartRouter.css";
import "./styles/latencyProfiler.css";
import "./styles/funding.css";
import "./styles/volSurface.css";
import "./styles/microstructure.css";
import "./styles/baselMetrics.css";
import "./styles/portfolioOptimizer.css";
import "./styles/alphaNotebook.css";
import "./styles/stressGenerator.css";
import "./styles/multiStrategy.css";
import "./styles/orderFlowLab.css";
import "./styles/regimePortfolio.css";
import "./styles/executionReplay.css";
import "./styles/liquidityStress.css";
import "./styles/arbitrageRadar.css";
import "./styles/syntheticLab.css";
import "./styles/marketMaking.css";
import "./styles/latencyArb.css";
import "./styles/smartHedger.css";
import "./styles/optionsMM.css";
import "./styles/riskFirewall.css";
import "./styles/yieldCurve.css";
import "./styles/costForecaster.css";
import "./styles/globalMacro.css";   // ✔ fixed typo
import "./styles/liquidityEngine.css";
import "./styles/marketStability.css";
import "./styles/riskParity.css";
import "./styles/leadLag.css";
import "./styles/microCrash.css";
import "./styles/capitalFlows.css";
import "./styles/stressCorrelation.css";
import "./styles/executionRisk.css";
import "./styles/systemicRisk.css";
import "./styles/liquidityFragmentation.css";
import "./styles/alphaDecay.css";
import "./styles/macroRegime.css";
import "./styles/carryEngine.css";
import "./styles/executionAttribution.css";
import "./styles/crossAsset.css";
import "./styles/forecastEngine.css";
import "./styles/tailRisk.css";
import "./styles/liquidityMap.css";
import "./styles/volCarry.css";
import "./styles/capacityEstimator.css";
import "./styles/macroStress.css";
import "./styles/correlationRegime.css";
import "./styles/executionFootprint.css";
import "./styles/volSurfaceRegime.css";
import "./styles/termStructure.css";
import "./styles/robustnessLab.css";
import "./styles/macroEarlyWarning.css";
import "./styles/trendEngine.css";
import "./styles/microstructureReplay.css";
import "./styles/microRegime.css";
import "./styles/liquidityShockboard.css";
import "./styles/metaAnalyzer.css";
import "./styles/marketStateMachine.css";
import "./styles/signalOrtho.css";
import "./styles/timingAlpha.css";
import "./styles/marketIntelligence.css";
import "./styles/shockPropagation.css";
import "./styles/strategyLifecycle.css";
import "./styles/marketFusion.css";
import "./styles/alphaMap.css";
import "./styles/strategyStressLab.css";
import "./styles/regimeAtlas.css";
import "./styles/alphaDecaySurface.css";
import "./styles/executionScenarioLab.css";
import "./styles/strategyDrift.css";
import "./styles/volInteraction.css";
import "./styles/liquidityFracture.css";
import "./styles/globalCommandCenter.css";
import "./styles/strategySuperLab.css";
import "./styles/executionSuperConsole.css";
import "./styles/macroMicroFusionBoard.css";
import "./styles/liqVolObservatory.css";

// THEME INITIALIZATION
import { setTheme } from "./theme";

// AUTH CONTEXT PROVIDER
import { AuthProvider } from "./context/AuthContext.jsx";

// Apply theme BEFORE the app renders
setTheme("dark");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </React.StrictMode>
);

