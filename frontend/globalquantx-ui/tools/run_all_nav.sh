#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 GlobalQuantX Navigation Auto‑Generation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ensure scripts are executable
chmod +x tools/gen_nav_index.sh
chmod +x tools/gen_routes.sh
chmod +x tools/gen_icon_shortcuts.sh

echo "🔧 Step 1: Generating iconMap + shortcutMap..."
./tools/gen_icon_shortcuts.sh
echo "   ✔ iconMap + shortcutMap generated."
echo ""

echo "🔧 Step 2: Generating NAV_INDEX..."
./tools/gen_nav_index.sh
echo "   ✔ NAV_INDEX generated."
echo ""

echo "🔧 Step 3: Generating auto‑routes..."
./tools/gen_routes.sh
echo "   ✔ GeneratedRoutes.jsx created."
echo ""

echo "🎉 All navigation systems updated successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Your OS‑shell is now fully synchronized."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

