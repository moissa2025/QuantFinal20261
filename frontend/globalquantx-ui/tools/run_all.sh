#!/bin/bash
set -e
cd "$(dirname "$0")"

echo "🧼 Cleaning previous generated artifacts..."
echo "🏗  Running full GlobalQuantX UI platform generation..."
bash ./cleanup_duplicates.sh
bash ./gen_platform.sh

# 1) Generate generic pages
bash ./gen_pages.sh

# 2) Generate Control Center concrete pages
bash ./gen_control_center.sh

# 3) Generate platform (layout, routes, RBAC, nav)
bash ./gen_platform.sh

# 4) Generate DTOs
bash ./gen_dtos.sh

# 5) Generate service bindings
bash ./gen_bindings.sh

# 6) Generate mocks
bash ./gen_mocks.sh

# health checks...

