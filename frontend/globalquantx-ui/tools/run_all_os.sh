#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 GlobalQuantX OS Shell Regeneration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

chmod +x tools/gen_icon_shortcuts.sh
chmod +x tools/gen_nav_index.sh
chmod +x tools/gen_routes.sh

echo "🔧 Step 1: Generating iconMap + shortcutMap..."
./tools/gen_icon_shortcuts.sh
echo "   ✔ iconMap + shortcutMap updated."
echo ""

echo "🔧 Step 2: Generating NAV_INDEX..."
./tools/gen_nav_index.sh
echo "   ✔ navigationIndex.js updated."
echo ""

echo "🔧 Step 3: Generating auto‑routes..."
./tools/gen_routes.sh
echo "   ✔ GeneratedRoutes.jsx updated."
echo ""

echo "🎉 OS Shell regeneration complete."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

