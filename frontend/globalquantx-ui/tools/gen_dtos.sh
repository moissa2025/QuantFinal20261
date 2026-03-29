#!/bin/bash
set -e

ROOT="../src"
OUT="$ROOT/services/dtos.ts"
MAP="$ROOT/config/ui_service_map.json"

echo "📦 Generating typed DTOs from UI–Service Map..."
mkdir -p "$(dirname "$OUT")"

cat > "$OUT" <<EOF
// AUTO-GENERATED. DO NOT EDIT.
// DTOs for GlobalQuantX services.

export interface Position {
  id: string;
  symbol: string;
  quantity: number;
  pnl: number;
  currency: string;
}

export interface Order {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  quantity: number;
  price?: number;
  status: string;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  direction: "DEBIT" | "CREDIT";
  bookedAt: string;
  reference?: string;
}

export interface RiskExposure {
  id: string;
  book: string;
  symbol: string;
  delta: number;
  gamma?: number;
  vega?: number;
  currency: string;
}

export interface SystemHealth {
  service: string;
  status: "UP" | "DEGRADED" | "DOWN";
  latencyMs: number;
  lastCheck: string;
}

export interface UserSummary {
  id: string;
  email: string;
  role: string;
  status: string;
}
EOF

echo "✨ DTOs generated at $OUT"

