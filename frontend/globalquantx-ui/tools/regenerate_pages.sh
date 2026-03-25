#!/bin/bash

set -e

PAGES_FILE="pages.txt"
BASE_DIR="../src/pages"

echo "🔥 Regenerating all pages from $PAGES_FILE"

# 1. Delete old pages
echo "🧹 Removing old pages..."
rm -rf "$BASE_DIR"
mkdir -p "$BASE_DIR"

# 2. Recreate folder structure
while IFS= read -r line; do
  echo "Processing: $line"

  # Skip empty lines
  [[ -z "$line" ]] && continue

  # Extract folder and file
  DIR=$(dirname "$line")
  FILE=$(basename "$line")
  TARGET_DIR="$BASE_DIR/$DIR"

  mkdir -p "$TARGET_DIR"

  # Determine correct relative import path (always pointing to src/layout)
  if [[ "$DIR" == "." ]]; then
    # Root-level page (Landing.jsx)
    IMPORT_PATH="./layout"
  else
    # Count folder depth relative to src/pages
    DEPTH=$(echo "$DIR" | awk -F"/" '{print NF}')
    # Go up (DEPTH + 1) levels to reach src/
    UP_PATH=$(printf "../%.0s" $(seq 1 $((DEPTH + 1))))
    IMPORT_PATH="${UP_PATH}layout"
  fi

  # Generate file
  cat > "$TARGET_DIR/$FILE.jsx" <<EOF
import DockablePanel from "${IMPORT_PATH}/DockablePanel.jsx";
import Page from "${IMPORT_PATH}/Page.jsx";

export default function ${FILE}() {
  return (
    <DockablePanel title="${FILE}">
      <Page>
        <section>
          {/* TODO: paste original content here */}
        </section>
      </Page>
    </DockablePanel>
  );
}
EOF

  echo "✅ Generated: $TARGET_DIR/$FILE.jsx"

done < "$PAGES_FILE"

echo "🎉 All pages regenerated successfully!"

