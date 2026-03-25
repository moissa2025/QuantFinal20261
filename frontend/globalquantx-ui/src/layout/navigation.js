// src/layout/navigationIndex.js
// Central navigation registry for GlobalQuantX OS

export const NAV_INDEX = [
  // ───────────────────────────────
  // Core Trading & Desk Modules
  // ───────────────────────────────
  { label: "Multi‑Asset Desk", path: "/", category: "Core" },
  { label: "Dashboard", path: "/dashboard", category: "Core" },
  { label: "Trading Terminal", path: "/trading", category: "Core" },
  { label: "Positions & PnL", path: "/positions", category: "Core" },
  { label: "Ledger", path: "/ledger", category: "Core" },
  { label: "Risk", path: "/risk", category: "Core" },
  { label: "Strategies", path: "/strategies", category: "Core" },
  { label: "Market Data", path: "/market-data", category: "Core" },

  // ───────────────────────────────
  // Public / Marketing Pages
  // ───────────────────────────────
  { label: "Contact", path: "/contact", category: "Public" },
  { label: "About", path: "/about", category: "Public" },
  { label: "Legal", path: "/legal", category: "Public" },
  { label: "Privacy", path: "/privacy", category: "Public" },
  { label: "Terms", path: "/terms", category: "Public" },

  // ───────────────────────────────
  // System & Support
  // ───────────────────────────────
  { label: "Support", path: "/support", category: "System" },
  { label: "Status", path: "/status", category: "System" },

  // ───────────────────────────────
  // Developer / API
  // ───────────────────────────────
  { label: "API Docs", path: "/api-docs", category: "Developers" },

  // ───────────────────────────────
  // App Pages (from /pages/app)
  // ───────────────────────────────
  { label: "Notifications", path: "/app/notifications", category: "App" },
  { label: "Audit Logs", path: "/app/audit-logs", category: "App" },
  { label: "Admin", path: "/app/admin", category: "App" },
  { label: "System Status", path: "/app/system-status", category: "App" },
  { label: "Billing", path: "/app/billing", category: "App" },
  { label: "Support Center", path: "/app/support", category: "App" },
  { label: "User Activity", path: "/app/user-activity", category: "App" },
  { label: "Branding", path: "/app/branding", category: "App" },
  { label: "Webhooks", path: "/app/webhooks", category: "App" },
  { label: "Developer Playground", path: "/app/developer-playground", category: "App" },
  { label: "Data Export", path: "/app/data-export", category: "App" },
  { label: "Order Entry", path: "/app/order-entry", category: "App" },
  { label: "API Keys", path: "/app/api-keys", category: "App" },
  { label: "Notification Templates", path: "/app/notification-templates", category: "App" },
  { label: "User Profile", path: "/app/user-profile", category: "App" },

  // ───────────────────────────────
  // Admin Pages (from /pages/admin)
  // ───────────────────────────────
  { label: "Order Flow Lab", path: "/admin/order-flow-lab", category: "Admin" },
  { label: "Smart Router", path: "/admin/smart-router", category: "Admin" },
  { label: "Feature Flags", path: "/admin/feature-flags", category: "Admin" },
  { label: "Vol Carry", path: "/admin/vol-carry", category: "Admin" },
  { label: "Vol Regime", path: "/admin/vol-regime", category: "Admin" },
  { label: "Correlation", path: "/admin/correlation", category: "Admin" },
  { label: "Alpha Map", path: "/admin/alpha-map", category: "Admin" },
  { label: "Liquidity Stress", path: "/admin/liquidity-stress", category: "Admin" },
  { label: "Strategy Stress Lab", path: "/admin/strategy-stress-lab", category: "Admin" },
  { label: "Disaster Recovery", path: "/admin/disaster-recovery", category: "Admin" },
  { label: "Market Stability", path: "/admin/market-stability", category: "Admin" },
  { label: "Execution Quality", path: "/admin/execution-quality", category: "Admin" },
  { label: "Execution Attribution", path: "/admin/execution-attribution", category: "Admin" },
  { label: "Stress Generator", path: "/admin/stress-generator", category: "Admin" },
  { label: "Multi‑Tenant", path: "/admin/multi-tenant", category: "Admin" },
  { label: "Portfolio Risk", path: "/admin/portfolio-risk", category: "Admin" },
  { label: "Vol Surface", path: "/admin/vol-surface", category: "Admin" },
  { label: "Risk Firewall", path: "/admin/risk-firewall", category: "Admin" },
  { label: "Forecast Engine", path: "/admin/forecast-engine", category: "Admin" },
  { label: "Shock Propagation", path: "/admin/shock-propagation", category: "Admin" },
  { label: "Tail Risk", path: "/admin/tail-risk", category: "Admin" },
  { label: "Yield Curve", path: "/admin/yield-curve", category: "Admin" },
  { label: "Risk Center", path: "/admin/risk-center", category: "Admin" },
  { label: "Carry Engine", path: "/admin/carry-engine", category: "Admin" },
  { label: "Options MM", path: "/admin/options-mm", category: "Admin" },
  { label: "Term Structure", path: "/admin/term-structure", category: "Admin" },
  { label: "Correlation Regime", path: "/admin/correlation-regime", category: "Admin" },
  { label: "Execution Risk", path: "/admin/execution-risk", category: "Admin" },
  { label: "Market Making", path: "/admin/market-making", category: "Admin" },
  { label: "Basel Metrics", path: "/admin/basel-metrics", category: "Admin" },
  { label: "Meta Analyzer", path: "/admin/meta-analyzer", category: "Admin" },
  { label: "Microstructure Replay", path: "/admin/microstructure-replay", category: "Admin" },
  { label: "Funding", path: "/admin/funding", category: "Admin" },
  { label: "Synthetic Lab", path: "/admin/synthetic-lab", category: "Admin" },
  { label: "Market Replay", path: "/admin/market-replay", category: "Admin" },
  { label: "Stress Correlation", path: "/admin/stress-correlation", category: "Admin" },
  { label: "Timing Alpha", path: "/admin/timing-alpha", category: "Admin" },
  { label: "Market State Machine", path: "/admin/market-state-machine", category: "Admin" },
  { label: "Alpha Notebook", path: "/admin/alpha-notebook", category: "Admin" },
  { label: "Macro Early Warning", path: "/admin/macro-early-warning", category: "Admin" },
  { label: "Capital Flows", path: "/admin/capital-flows", category: "Admin" },
  { label: "Vol Surface Regime", path: "/admin/vol-surface-regime", category: "Admin" },
  { label: "Regulatory", path: "/admin/regulatory", category: "Admin" },
  { label: "Latency Arb", path: "/admin/latency-arb", category: "Admin" },
  { label: "Macro Regime", path: "/admin/macro-regime", category: "Admin" },
  { label: "Capacity Estimator", path: "/admin/capacity-estimator", category: "Admin" },
  { label: "Global Macro", path: "/admin/global-macro", category: "Admin" },
  { label: "Broadcast", path: "/admin/broadcast", category: "Admin" },
  { label: "Regime Portfolio", path: "/admin/regime-portfolio", category: "Admin" },
  { label: "Matching Engine", path: "/admin/matching-engine", category: "Admin" },
  { label: "Compliance", path: "/admin/compliance", category: "Admin" },
  { label: "Microstructure", path: "/admin/microstructure", category: "Admin" },
  { label: "Smart Hedger", path: "/admin/smart-hedger", category: "Admin" },
  { label: "Market Fusion", path: "/admin/market-fusion", category: "Admin" },
  { label: "Capacity", path: "/admin/capacity", category: "Admin" },
  { label: "Latency Profiler", path: "/admin/latency-profiler", category: "Admin" },
  { label: "Liquidity Map", path: "/admin/liquidity-map", category: "Admin" },
  { label: "Strategy Lifecycle", path: "/admin/strategy-lifecycle", category: "Admin" },
  { label: "Execution Footprint", path: "/admin/execution-footprint", category: "Admin" },
  { label: "Macro Stress", path: "/admin/macro-stress", category: "Admin" },
  { label: "Multi‑Strategy", path: "/admin/multi-strategy", category: "Admin" },
  { label: "Trend Engine", path: "/admin/trend-engine", category: "Admin" },
  { label: "Internal Tools", path: "/admin/internal-tools", category: "Admin" },
  { label: "Risk Parity", path: "/admin/risk-parity", category: "Admin" },
  { label: "Systemic Risk", path: "/admin/systemic-risk", category: "Admin" },
  { label: "Liquidity Fragmentation", path: "/admin/liquidity-fragmentation", category: "Admin" },
  { label: "Execution Replay", path: "/admin/execution-replay", category: "Admin" },
  { label: "Impersonation", path: "/admin/impersonation", category: "Admin" },
  { label: "Signal Ortho", path: "/admin/signal-ortho", category: "Admin" },
  { label: "Liquidity Engine", path: "/admin/liquidity-engine", category: "Admin" },
  { label: "Cross‑Asset", path: "/admin/cross-asset", category: "Admin" },
  { label: "Micro Crash", path: "/admin/micro-crash", category: "Admin" },
  { label: "Arbitrage Radar", path: "/admin/arbitrage-radar", category: "Admin" },
  { label: "Observability", path: "/admin/observability", category: "Admin" },
  { label: "Market Intelligence", path: "/admin/market-intelligence", category: "Admin" },
  { label: "Portfolio Optimizer", path: "/admin/portfolio-optimizer", category: "Admin" },
  { label: "Robustness Lab", path: "/admin/robustness-lab", category: "Admin" },
  { label: "Lead‑Lag", path: "/admin/lead-lag", category: "Admin" },
  { label: "Micro Regime", path: "/admin/micro-regime", category: "Admin" },
  { label: "Liquidity Shockboard", path: "/admin/liquidity-shockboard", category: "Admin" },
  { label: "Cost Forecaster", path: "/admin/cost-forecaster", category: "Admin" },
];

