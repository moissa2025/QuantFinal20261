#!/usr/bin/env bash
set -e

echo "🔍 Cleaning and normalizing SQLX dependencies..."

find backend/services -name Cargo.toml | while read -r file; do
    if grep -qE '^sqlx = \{ version' "$file"; then
        echo "⚙️  Fixing: $file"

        # Remove the entire inline sqlx block (from the sqlx line until the closing ])
        sed -i '' '/^sqlx = { version/,/]/d' "$file"

        # Insert correct block after [dependencies]
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

echo "🎉 SQLX dependencies normalized successfully."

