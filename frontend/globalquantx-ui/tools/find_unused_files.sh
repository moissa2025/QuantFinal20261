#!/bin/bash

echo "🔍 Scanning for unused files..."

ROOT="src"

# Extensions we consider as code files
EXTENSIONS="js jsx ts tsx"

# Collect all files
ALL_FILES=$(find "$ROOT" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \))

# Build a dependency graph
declare -A USED

resolve_import() {
  local file_dir="$1"
  local import_path="$2"

  # Strip quotes
  import_path="${import_path%\"}"
  import_path="${import_path#\"}"

  # Skip external modules
  if [[ "$import_path" != .* ]]; then
    return
  fi

  # Build absolute path
  local abs="$file_dir/$import_path"

  # Normalize
  abs=$(cd "$(dirname "$abs")" 2>/dev/null && pwd)/$(basename "$abs")

  # Try resolving file with extensions
  for ext in $EXTENSIONS; do
    if [[ -f "$abs.$ext" ]]; then
      USED["$abs.$ext"]=1
      return
    fi
  done

  # Try index files
  for ext in $EXTENSIONS; do
    if [[ -f "$abs/index.$ext" ]]; then
      USED["$abs/index.$ext"]=1
      return
    fi
  done

  # Try static assets
  for ext in svg png jpg jpeg webp; do
    if [[ -f "$abs.$ext" ]]; then
      USED["$abs.$ext"]=1
      return
    fi
  done
}

# Mark entry points as used
USED["src/main.jsx"]=1
USED["src/App.jsx"]=1
USED["src/layout/Layout.jsx"]=1

# Parse imports
for FILE in $ALL_FILES; do
  FILE_DIR=$(dirname "$FILE")

  # Mark file itself as used if it's an entry point
  if [[ "${USED[$FILE]}" == "1" ]]; then
    :
  fi

  # Extract imports
  grep -E "import .* from " "$FILE" | while read LINE; do
    IMPORT=$(echo "$LINE" | sed -E 's/.*from ["'\''](.*)["'\''].*/\1/')
    resolve_import "$FILE_DIR" "$IMPORT"
  done
done

# Report unused files
UNUSED=0
for FILE in $ALL_FILES; do
  if [[ -z "${USED[$FILE]}" ]]; then
    echo "⚠️ Unused file: $FILE"
    UNUSED=$((UNUSED+1))
  fi
done

echo "⚠️ Total unused files: $UNUSED"

