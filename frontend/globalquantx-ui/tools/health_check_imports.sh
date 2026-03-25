#!/bin/bash

echo "🔍 Running GlobalQuantX import health check..."

ROOT="src"

# Try resolving a file with multiple possible extensions
try_resolve_file() {
  local path="$1"

  # Exact file
  [[ -f "$path" ]] && return 0

  # Try JS/JSX/TS/TSX
  for ext in js jsx ts tsx; do
    [[ -f "$path.$ext" ]] && return 0
  done

  # Try index.js inside folder
  for ext in js jsx ts tsx; do
    [[ -f "$path/index.$ext" ]] && return 0
  done

  # Try static assets
  for ext in svg png jpg jpeg webp; do
    [[ -f "$path.$ext" ]] && return 0
  done

  return 1
}

# Resolve relative import path
resolve_import() {
  local file_dir="$1"
  local import_path="$2"

  # Strip quotes
  import_path="${import_path%\"}"
  import_path="${import_path#\"}"

  # Skip external modules
  if [[ "$import_path" != .* ]]; then
    echo "__EXTERNAL__"
    return
  fi

  # Build absolute path
  local abs_path="$file_dir/$import_path"

  # Normalize path
  abs_path=$(cd "$(dirname "$abs_path")" 2>/dev/null && pwd)/$(basename "$abs_path")

  echo "$abs_path"
}

# Scan all files
find "$ROOT" -type f \( -name "*.jsx" -o -name "*.js" \) | while read FILE; do
  FILE_DIR=$(dirname "$FILE")

  grep -E "import .* from " "$FILE" | while read LINE; do
    IMPORT=$(echo "$LINE" | sed -E 's/.*from ["'\''](.*)["'\''].*/\1/')

    RESOLVED=$(resolve_import "$FILE_DIR" "$IMPORT")

    # Skip external modules
    if [[ "$RESOLVED" == "__EXTERNAL__" ]]; then
      continue
    fi

    # Check if file exists
    if ! try_resolve_file "$RESOLVED"; then
      echo ""
      echo "❌ Broken import in $FILE"
      echo "   → $IMPORT"
    fi
  done
done

echo ""
echo "✔ Health check complete."

