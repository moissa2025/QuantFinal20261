#!/bin/bash
set -e

ROOT="../src"
PAGES_DIR="$ROOT/pages"

echo "📝 Generating GlobalQuantX pages (contentful)..."

mkdir -p "$PAGES_DIR/public" "$PAGES_DIR/app" "$PAGES_DIR/admin"

write_page() {
  local section="$1"
  local name="$2"
  local title="$3"
  local subtitle="$4"
  local body="$5"

  local dir="$PAGES_DIR/$section"
  local file="$dir/$name.jsx"

  mkdir -p "$dir"

  # Lowercase versions for CSS classes
  local section_lc=$(echo "$section" | tr '[:upper:]' '[:lower:]')
  local name_lc=$(echo "$name" | tr '[:upper:]' '[:lower:]')

  cat > "$file" <<EOF
import React from "react";

export default function ${name}() {
  return (
    <div className="page page-${section_lc} page-${name_lc}">
      <div className="page-header">
        <h1>${title}</h1>
        <p>${subtitle}</p>
      </div>
      <div className="page-body">
        <p>${body}</p>
      </div>
    </div>
  );
}
EOF

  echo "✓ Page: $section/$name.jsx"
}

# --- PUBLIC PAGES ---

write_page "public" "Landing" \
  "GlobalQuantX Control Plane" \
  "Institutional multi-asset trading, risk, and operations in one unified surface." \
  "Welcome to GlobalQuantX. This control plane surfaces trading, risk, system health, and client-facing experiences in a single, coherent environment."

write_page "public" "Login" \
  "Sign in to GlobalQuantX" \
  "Secure access to the institutional trading and risk platform." \
  "Use your institutional credentials or SSO provider to access trading, risk, and operational tooling."

write_page "public" "Support" \
  "Support & Operations" \
  "Get help with onboarding, connectivity, and production incidents." \
  "Reach out for connectivity issues, onboarding questions, production incidents, or integration support."

write_page "public" "LegalPrivacy" \
  "Privacy Policy" \
  "How GlobalQuantX handles data, telemetry, and client information." \
  "This page describes how data is collected, processed, and retained across the GlobalQuantX platform."

write_page "public" "LegalTerms" \
  "Terms of Use" \
  "Contractual terms governing access to the GlobalQuantX platform." \
  "Review the terms that govern platform access, usage, and service boundaries."

write_page "public" "RiskDisclosure" \
  "Risk Disclosure" \
  "Key risks associated with trading and market access." \
  "Trading involves risk, including potential loss of capital. This page outlines key risk disclosures."

write_page "public" "Privacy" \
  "Privacy" \
  "High-level privacy overview for clients and prospects." \
  "A concise overview of how GlobalQuantX approaches privacy, security, and data minimization."

write_page "public" "Terms" \
  "Terms" \
  "Summary of key contractual terms." \
  "A summarized view of the most important contractual and operational terms."

# --- APP PAGES ---

write_page "app" "Dashboard" \
  "Trading Desk Overview" \
  "Positions, P&L, risk, and system health at a glance." \
  "Use this dashboard as your primary cockpit for intraday monitoring across positions, risk, and connectivity."

write_page "app" "Market" \
  "Market View" \
  "Live markets, depth, and liquidity context." \
  "Monitor instruments, liquidity, spreads, and execution venues relevant to your strategies."

write_page "app" "OrderEntry" \
  "Order Entry" \
  "Submit, amend, and cancel orders with full auditability." \
  "Place and manage orders with clear routing, risk checks, and full audit trails."

write_page "app" "Portfolio" \
  "Portfolio" \
  "Holdings, exposures, and performance over time." \
  "Review portfolio composition, exposures by asset class, and performance attribution."

write_page "app" "Positions" \
  "Positions" \
  "Intraday and end-of-day positions across instruments." \
  "Track net and gross positions, sensitivities, and concentration across books."

write_page "app" "Ledger" \
  "Ledger" \
  "Cash movements, fees, and reconciliations." \
  "Inspect ledger entries, funding flows, and reconciliation status."

write_page "app" "SystemStatus" \
  "System Status" \
  "Connectivity, gateways, and downstream dependencies." \
  "Monitor health of gateways, market data, order routing, and external dependencies."

write_page "app" "Settings" \
  "Settings" \
  "User and workspace configuration." \
  "Configure preferences, notifications, and workspace-level settings."

write_page "app" "Notifications" \
  "Notifications" \
  "Operational and trading alerts." \
  "Review alerts related to risk, connectivity, and operational workflows."

write_page "app" "DeveloperPlayground" \
  "Developer Playground" \
  "Experiment with APIs and integrations in a safe sandbox." \
  "Use this area to test API calls, webhooks, and integration flows."

write_page "app" "Support" \
  "Desk Support" \
  "Internal support surface for traders and operations." \
  "Raise internal tickets, track incidents, and coordinate with support teams."

write_page "app" "UserProfile2" \
  "User Profile" \
  "Identity, roles, and access footprint." \
  "View and manage your profile, roles, and access footprint across environments."

write_page "app" "UserActivity" \
  "User Activity" \
  "Recent actions and audit trails." \
  "Inspect recent actions, approvals, and key events tied to your identity."

write_page "app" "Trading" \
  "Trading Workspace" \
  "Execution-focused workspace for active traders." \
  "A focused surface for order entry, blotters, and execution analytics."

write_page "app" "Webhooks" \
  "Webhooks" \
  "Outbound event delivery configuration." \
  "Configure and monitor outbound webhooks for downstream systems."

write_page "app" "Billing" \
  "Billing & Invoicing" \
  "Usage, invoices, and billing contacts." \
  "Review invoices, usage metrics, and billing contacts."

write_page "app" "ApiDocs" \
  "API Documentation" \
  "Programmatic access to GlobalQuantX." \
  "Explore REST, streaming, and webhook APIs with examples and schemas."

write_page "app" "ApiKeys" \
  "API Keys" \
  "Manage credentials for programmatic access." \
  "Create, rotate, and revoke API keys with clear scoping."

# --- ADMIN PAGES ---

write_page "admin" "AdminDashboard" \
  "Control Center" \
  "Administrative overview across tenants, systems, and risk." \
  "Use this view to monitor platform-wide health, tenants, and administrative signals."

write_page "admin" "AdminLedger" \
  "Admin Ledger" \
  "Oversight of ledger integrity and reconciliations." \
  "Review ledger integrity, reconciliation status, and exception workflows."

write_page "admin" "AdminRisk" \
  "Risk Center" \
  "Platform-level risk and policy enforcement." \
  "Monitor risk limits, breaches, and policy enforcement across the platform."

write_page "admin" "AdminSystem" \
  "System Administration" \
  "Configuration, environments, and operational controls." \
  "Manage environments, configuration, and operational toggles."

write_page "admin" "AdminUsers" \
  "User Administration" \
  "Roles, permissions, and access governance." \
  "Administer users, roles, and access policies across tenants."
# --- ADMIN: Service Health Dashboard ---
write_page "admin" "ServiceHealth" \
  "Service Health" \
  "Live status of backend microservices." \
  "This dashboard displays the health, latency, and availability of all backend services in the GlobalQuantX platform."

echo "✨ GlobalQuantX page generation complete."

