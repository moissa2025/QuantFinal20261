#!/usr/bin/env bash
set -euo pipefail

ROOT="backend/services"

find "$ROOT" -name "Cargo.toml" | while read -r file; do
  echo "Cleaning $file"

  deps_seen=0
  skip_block=0

  tmp="${file}.tmp"
  : > "$tmp"

  while IFS='' read -r line || [ -n "$line" ]; do

    # Detect section headers like [something]
    case "$line" in
      "[dependencies]")
        if [ $deps_seen -eq 1 ]; then
          skip_block=1
          continue
        else
          deps_seen=1
          skip_block=0
        fi
        ;;
      

\[*\]

)
        skip_block=0
        ;;
    esac

    if [ $skip_block -eq 1 ]; then
      continue
    fi

    echo "$line" >> "$tmp"
  done < "$file"

  mv "$tmp" "$file"
done
