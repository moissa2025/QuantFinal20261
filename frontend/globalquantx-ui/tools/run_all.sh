#!/bin/bash

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔥 GlobalQuantX FULL SYSTEM REBUILD"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

chmod +x tools/run_all_os.sh
chmod +x tools/run_all_pages.sh

echo "🔧 Step 1: Rebuilding OS Shell..."
./tools/run_all_os.sh
echo ""

echo "🔧 Step 2: Injecting DockablePanels into pages..."
./tools/run_all_pages.sh
echo ""

echo "🎉 FULL SYSTEM REBUILD COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Your OS, routes, NAV_INDEX, icons, shortcuts,"
echo "and dockable panels are now fully synchronized."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

