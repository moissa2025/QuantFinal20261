#!/bin/bash

ROOT="src/pages"

echo "🚀 Embedding DockablePanel into all page components..."

# Loop through all JSX files under src/pages/**
find "$ROOT" -type f -name "*.jsx" | while read FILE; do
  echo "⚙️  Processing: $FILE"

  # Extract the filename without extension
  BASENAME=$(basename "$FILE" .jsx)

  # Convert CamelCase → kebab-case for path
  KEYPATH=$(echo "$BASENAME" | sed -E 's/([A-Z])/-\L\1/g' | sed 's/^-//')

  # Determine category (app/admin/public)
  CATEGORY=$(echo "$FILE" | sed -E 's|src/pages/([^/]+)/.*|\1|')

  # Build route path
  ROUTE="/$CATEGORY/$KEYPATH"

  # Check if DockablePanel already exists
  if grep -q "DockablePanel" "$FILE"; then
    echo "   → Already contains DockablePanel. Skipping."
    continue
  fi

  # Insert import at top
  sed -i '' '1s/^/import DockablePanel from "..\/..\/layout\/DockablePanel.jsx";\n/' "$FILE"

  # Insert DockablePanel wrapper around existing JSX
  sed -i '' "s/export default function/export default function/; \
    s/return (/return (\n    <DockablePanel id=\"$KEYPATH\" title=\"$BASENAME\" path=\"$ROUTE\">\n/" "$FILE"

  # Insert closing tag before final closing parenthesis
  sed -i '' 's/);$/    <\/DockablePanel>\n  );/' "$FILE"

  echo "   → DockablePanel embedded."
done

echo "🎉 Completed embedding DockablePanels."

