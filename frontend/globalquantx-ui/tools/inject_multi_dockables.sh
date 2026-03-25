#!/bin/bash

ROOT="src/pages"

echo "🚀 Injecting MULTIPLE DockablePanels into all page components..."

find "$ROOT" -type f -name "*.jsx" | while read FILE; do
  echo "⚙️  Processing: $FILE"

  # Skip if DockablePanel already exists
  if grep -q "DockablePanel" "$FILE"; then
    echo "   → DockablePanels already present. Skipping."
    continue
  fi

  BASENAME=$(basename "$FILE" .jsx)
  CATEGORY=$(echo "$FILE" | sed -E 's|src/pages/([^/]+)/.*|\1|')
  KEYPATH=$(echo "$BASENAME" | sed -E 's/([A-Z])/-\L\1/g' | sed 's/^-//')
  ROUTE="/$CATEGORY/$KEYPATH"

  # Insert import
  sed -i '' '1s/^/import DockablePanel from "..\/..\/layout\/DockablePanel.jsx";\n/' "$FILE"

  # Insert multiple DockablePanels inside return(
  sed -i '' "/return (/a\\
    <div className=\"page-dockables\">\\
      <DockablePanel id=\"${KEYPATH}-overview\" title=\"${BASENAME} Overview\" path=\"${ROUTE}\">\\
        <div>Overview widget for ${BASENAME}</div>\\
      </DockablePanel>\\
      <DockablePanel id=\"${KEYPATH}-metrics\" title=\"${BASENAME} Metrics\" path=\"${ROUTE}\">\\
        <div>Metrics widget for ${BASENAME}</div>\\
      </DockablePanel>\\
      <DockablePanel id=\"${KEYPATH}-analytics\" title=\"${BASENAME} Analytics\" path=\"${ROUTE}\">\\
        <div>Analytics widget for ${BASENAME}</div>\\
      </DockablePanel>\\
    </div>
  " "$FILE"

  echo "   → Injected 3 DockablePanels."
done

echo "🎉 Completed multi‑panel injection."

