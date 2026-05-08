#!/bin/bash

set -e

ROUTES_DIR="services/api-gateway/src/routes"

echo "🔍 Scanning route modules in: $ROUTES_DIR"
echo

for file in "$ROUTES_DIR"/*.rs; do
    echo "➡️  Processing: $file"

    # Create backup
    cp "$file" "$file.bak"

    # Replace Router<Arc<AppState>> with Router
    sed -i '' 's/pub fn router() -> Router<Arc<AppState>>/pub fn router() -> Router/g' "$file"

    echo "   ✔ Updated (backup: $file.bak)"
done

echo
echo "🎉 DONE — all route modules updated safely."

