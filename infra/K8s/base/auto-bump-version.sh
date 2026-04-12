#!/bin/bash
set -e

# Detect current version from any deployment.yaml (excluding auth-service)
CURRENT=$(grep -R "image: .*:v" -h . \
  | grep -v "auth-service" \
  | head -n 1 \
  | sed -E 's/.*:v([0-9]+\.[0-9]+\.[0-9]+).*/\1/')

if [ -z "$CURRENT" ]; then
  echo "❌ Could not detect current version"
  exit 1
fi

echo "🔍 Current version: v$CURRENT"

# Split into components
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"

# Bump patch version
PATCH=$((PATCH + 1))
NEW="v$MAJOR.$MINOR.$PATCH"

echo "🚀 Bumping to new version: $NEW"

# Update all deployment.yaml files except auth-service
find . -type f -name "deployment.yaml" ! -path "*/auth-service/*" \
  -exec sed -i '' "s/:v$CURRENT/:$NEW/g" {} +

echo "🛠 Updated deployment.yaml files"

# Print final confirmation
echo "🎉 Version bump complete: $NEW"

