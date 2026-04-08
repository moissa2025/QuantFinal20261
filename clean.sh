#!/usr/bin/env bash
set -e

echo "🔍 Normalizing SQLX dependencies across workspace..."

find backend/services -name Cargo.toml | while read -r file; do
    # Detect inline SQLX dependency
    if grep -qE '^sqlx = \{ version' "$file"; then
        echo "⚙️  Fixing SQLX inline block in: $file"

        # Remove the inline sqlx line
        sed -i '' '/^sqlx = { version/d' "$file"

        # Insert the correct block right after [dependencies]
        sed -i '' '/^

\[dependencies\]

/a\
[dependencies.sqlx]\
version = "0.7"\
features = [\
    "runtime-tokio",\
    "postgres",\
    "uuid",\
    "chrono",\
    "macros",\
    "offline"\
]\
' "$file"

        echo "✅ Updated: $file"
    fi
done

echo "🎉 All SQLX inline dependencies converted to offline‑ready table form."

