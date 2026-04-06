#!/bin/bash
set -e

echo "🔧 Fixing DATABASE_URL in all deployment.yaml files..."
echo ""

# Find all deployment.yaml files under service directories
for file in $(find . -type f -name "deployment.yaml"); do
  echo "📄 Updating $file"

  # Replace cockroachdb-public with cockroachdb
  sed -i.bak 's/cockroachdb-public/cockroachdb/g' "$file"
done

echo ""
echo "✅ All deployment.yaml files updated."
echo "🗂️ Backup files (*.bak) created next to originals."
echo ""
echo "You can now re-apply everything:"
echo "  ./deploy-all.sh"

