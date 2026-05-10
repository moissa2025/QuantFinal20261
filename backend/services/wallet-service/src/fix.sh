#!/bin/bash

echo "🔧 Fixing wallet-service folder structure..."

# Ensure required folders exist
mkdir -p handlers
mkdir -p nats_handlers
mkdir -p repository
mkdir -p routes
mkdir -p utils

# Ensure mod.rs files exist
touch routes/mod.rs
touch utils/mod.rs
touch repository/mod.rs
touch nats_handlers/mod.rs

# Clean invalid files
rm -f routes/history.rs
rm -f routes/crypto_history.rs
rm -f routes/subaccounts.rs
rm -f routes/crypto.rs
rm -f routes/binance.rs
rm -f routes/binance_health.rs

# Recreate correct route files
cat > routes/mod.rs << 'EOF'
pub mod fiat;
pub mod crypto;
pub mod crypto_history;
pub mod subaccounts;
pub mod fx;
pub mod binance;
pub mod binance_health;
EOF

# Recreate utils mod
cat > utils/mod.rs << 'EOF'
pub mod binance;
pub mod crypto;
pub mod fx;
EOF

# Recreate repository mod
cat > repository/mod.rs << 'EOF'
pub mod wallet_repo;
pub mod crypto_repo;
pub mod fx_repo;
pub mod subaccounts_repo;
EOF

# Recreate nats_handlers mod
cat > nats_handlers/mod.rs << 'EOF'
pub mod create_account;
pub mod credit;
pub mod debit;
pub mod transfer;
pub mod crypto_deposit;
pub mod crypto_withdraw;
pub mod response;
EOF

echo "✅ Folder structure enforced."

