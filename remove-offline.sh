#!/usr/bin/env bash
set -e

echo "🔧 Removing invalid SQLX 'offline' feature..."

find backend/services -name Cargo.toml | while read -r file; do
    if grep -q '

\[dependencies.sqlx\]

' "$file"; then
        echo "Fixing $file"
        sed -i '' 's/"offline",\?//g' "$file"
        sed -i '' 's/"offline"//g' "$file"
    fi
done

echo "✅ All SQLX 'offline' features removed."

