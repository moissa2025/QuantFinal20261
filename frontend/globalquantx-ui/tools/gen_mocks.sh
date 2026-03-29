#!/bin/bash
set -e

ROOT="../src"
MOCK_DIR="$ROOT/mocks"
mkdir -p "$MOCK_DIR"

echo "🧪 Generating mock API payloads..."

# System health
cat > "$MOCK_DIR/system_health.json" <<EOF
[
  { "service": "auth", "status": "UP", "latencyMs": 12, "lastCheck": "2025-01-01T10:00:00Z" },
  { "service": "trading", "status": "UP", "latencyMs": 18, "lastCheck": "2025-01-01T10:00:00Z" },
  { "service": "ledger", "status": "DEGRADED", "latencyMs": 85, "lastCheck": "2025-01-01T10:00:00Z" },
  { "service": "risk", "status": "UP", "latencyMs": 20, "lastCheck": "2025-01-01T10:00:00Z" }
]
EOF

# Users summary
cat > "$MOCK_DIR/users_summary.json" <<EOF
[
  { "id": "u-1", "email": "alice@example.com", "role": "ADMIN", "status": "ACTIVE" },
  { "id": "u-2", "email": "bob@example.com", "role": "TRADER", "status": "ACTIVE" },
  { "id": "u-3", "email": "carol@example.com", "role": "CLIENT", "status": "SUSPENDED" }
]
EOF

# Risk exposures
cat > "$MOCK_DIR/risk_exposures.json" <<EOF
[
  { "id": "rx-1", "book": "EQ-BOOK-1", "symbol": "AAPL", "delta": 120000, "currency": "USD" },
  { "id": "rx-2", "book": "FX-BOOK-2", "symbol": "EURUSD", "delta": -500000, "currency": "USD" }
]
EOF

# Risk exposures summary (for dashboard)
cat > "$MOCK_DIR/risk_exposures_summary.json" <<EOF
[
  { "id": "rx-1", "book": "EQ-BOOK-1", "symbol": "AAPL", "delta": 120000, "currency": "USD" }
]
EOF

# Ledger journal
cat > "$MOCK_DIR/ledger_journal.json" <<EOF
[
  {
    "id": "le-1",
    "accountId": "ACC-1001",
    "amount": 100000,
    "currency": "USD",
    "direction": "CREDIT",
    "bookedAt": "2025-01-01T09:00:00Z",
    "reference": "Trade T-1"
  },
  {
    "id": "le-2",
    "accountId": "ACC-2001",
    "amount": 100000,
    "currency": "USD",
    "direction": "DEBIT",
    "bookedAt": "2025-01-01T09:00:00Z",
    "reference": "Trade T-1"
  }
]
EOF

cat > "$ROOT/services/mockFetch.ts" <<EOF
export async function mockFetch(path: string) {
  if (path.includes("/system/health")) {
    const data = await import("../mocks/system_health.json");
    return data.default;
  }
  if (path.includes("/auth/users/summary")) {
    const data = await import("../mocks/users_summary.json");
    return data.default;
  }
  if (path.includes("/risk/exposures/summary")) {
    const data = await import("../mocks/risk_exposures_summary.json");
    return data.default;
  }
  if (path.includes("/risk/exposures")) {
    const data = await import("../mocks/risk_exposures.json");
    return data.default;
  }
  if (path.includes("/ledger/journal")) {
    const data = await import("../mocks/ledger_journal.json");
    return data.default;
  }
  return [];
}
EOF

echo "✨ Mock API payloads and mockFetch.ts generated."

