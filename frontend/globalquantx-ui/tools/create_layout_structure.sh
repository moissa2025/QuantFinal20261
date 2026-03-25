#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE="$DIR/../src/layout"

echo "🔧 Creating GlobalQuantX OS layout structure..."

mkdir -p "$BASE"

FILES=(
  "Layout.jsx"
  "Sidebar.jsx"
  "Topbar.jsx"
  "CommandPalette.jsx"
  "NotificationCenter.jsx"
  "EventBus.js"
  "ThemeContext.jsx"
  "GlobalSearch.jsx"
  "KeyboardShortcuts.jsx"
  "WindowManager.jsx"
  "DockablePanel.jsx"
  "navigationIndex.js"
)

for FILE in "${FILES[@]}"; do
  if [ ! -f "$BASE/$FILE" ]; then
    echo "📄 Creating missing file: $FILE"
    touch "$BASE/$FILE"
  else
    echo "✔ File exists: $FILE"
  fi
done

echo "🎉 Layout structure verified and ready."

