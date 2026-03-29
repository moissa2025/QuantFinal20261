#!/bin/bash
set -e

ROOT="../src/pages"

echo "🧹 Cleaning duplicate pages..."

find "$ROOT" -type f \
  \( -name "App*.jsx" -o -name "PublicPublic*.jsx" -o -name "AdminAdmin*.jsx" \) \
  -print -delete

echo "✨ Duplicate pages removed."

