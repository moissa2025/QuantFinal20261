#!/bin/bash
set -e

ROOT="../src"
PAGES="$ROOT/pages"
LAYOUT="$ROOT/layout"

echo "🏗️ Generating clean platform routing..."

IMPORTS=""
ROUTES=""

# Helper: convert filename to PascalCase component name
to_component() {
  local name="$1"
  name="${name%.jsx}"
  echo "$name" | sed -E 's/(^|_)([a-z])/\U\2/g'
}

# Helper: map clean page names to shortcodes
shortcode() {
  case "$1" in
    Dashboard) echo "/app/dash" ;;
    Ledger) echo "/app/led" ;;
    RiskCenter) echo "/app/rsk" ;;
    Market) echo "/app/mkt" ;;
    Positions) echo "/app/pos" ;;
    OrderEntry) echo "/app/ord" ;;
    Portfolio) echo "/app/pfl" ;;
    Trading) echo "/app/trd" ;;
    AdminSystem) echo "/adm/sys" ;;
    AdminUsers) echo "/adm/usr" ;;
    Landing) echo "/pub/lnd" ;;
    Login) echo "/pub/lgn" ;;
    Support) echo "/pub/sup" ;;
    LegalPrivacy) echo "/pub/lpr" ;;
    LegalTerms) echo "/pub/ter" ;;
    RiskDisclosure) echo "/pub/ris" ;;
    LiquidityMap) echo "/adm/map" ;;
    AlphaDecay) echo "/adm/dec" ;;
    ExecutionReplay) echo "/adm/rep" ;;
    *) echo "" ;;
  esac
}

# Scan clean pages only
while IFS= read -r file; do
  base=$(basename "$file")
  name="${base%.jsx}"

  # Skip duplicates
  [[ "$name" == App* ]] && continue
  [[ "$name" == PublicPublic* ]] && continue
  [[ "$name" == AdminAdmin* ]] && continue

  comp=$(to_component "$name")
  path=$(shortcode "$name")

  # Skip pages without a shortcode
  [[ -z "$path" ]] && continue

  IMPORTS+="import $comp from \"../pages/${file#"$PAGES/"}\";\n"
  ROUTES+="  <Route path=\"$path\" element={<$comp />} />\n"
done < <(find "$PAGES" -type f -name "*.jsx")

# Write GeneratedRoutes.jsx
cat > "$LAYOUT/GeneratedRoutes.jsx" <<EOF
// AUTO-GENERATED CLEAN ROUTER
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, getLandingPathForRole } from "../context/AuthContext.jsx";

$IMPORTS

function RoleLandingRedirect() {
  const { user } = useAuth();
  return <Navigate to={getLandingPathForRole(user.role)} replace />;
}

export default function GeneratedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleLandingRedirect />} />
$ROUTES
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}
EOF

echo "✨ Clean platform routing generated."

