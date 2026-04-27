#!/bin/bash

set -e

echo "🔍 Restoring SQLx macros (query! and query_as!) across auth-service..."

# Replace sqlx::query( → sqlx::query!(
grep -Rl "sqlx::query(" src | while read -r file; do
  echo "  ➤ Updating $file"
  sed -i '' 's/sqlx::query(/sqlx::query!(/g' "$file"
done

# Replace sqlx::query_as( → sqlx::query_as!(
grep -Rl "sqlx::query_as(" src | while read -r file; do
  echo "  ➤ Updating $file"
  sed -i '' 's/sqlx::query_as(/sqlx::query_as!(/g' "$file"
done

echo "✅ SQLx macros restored successfully."
echo "⚠️ Remember: CockroachDB must be reachable at compile time."

