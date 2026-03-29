#!/bin/bash
set -e

# FRONTEND ROOT
FRONTEND_ROOT="../src/services"
mkdir -p "$FRONTEND_ROOT"

# BACKEND ROOT
BACKEND_ROOT="../../backend/services"

echo "🔗 Generating frontend service bindings from backend routes..."

# Clean old bindings
rm -f "$FRONTEND_ROOT"/*.ts

# Helper: convert service folder name → TS file name
to_ts_name() {
  echo "$1" | sed 's/-service//' | sed 's/-/_/g'
}

# Helper: extract Rust routes
extract_rust_routes() {
  local service="$1"
  local file="$2"

  grep -RhoE '#

\[(get|post|put|delete|patch)\(".*"\)\]

' "$file" \
    | sed -E 's/#

\[//' | sed -E 's/\]

//' \
    | while read -r route; do
        method=$(echo "$route" | cut -d'(' -f1)
        path=$(echo "$route" | sed -E 's/.*"(.*)".*/\1/')
        echo "$method $path"
      done
}

# Helper: extract Python FastAPI routes
extract_python_routes() {
  local file="$1"

  grep -RhoE '@router\.(get|post|put|delete|patch)\(".*"\)' "$file" \
    | sed -E 's/@router\.//' \
    | sed -E 's/\)//' \
    | sed -E 's/\("//' \
    | sed -E 's/"//' \
    | sed -E 's/\("/ /'
}

# Iterate over backend services
for SERVICE_PATH in "$BACKEND_ROOT"/*; do
  if [ ! -d "$SERVICE_PATH" ]; then continue; fi

  SERVICE_NAME=$(basename "$SERVICE_PATH")
  TS_NAME=$(to_ts_name "$SERVICE_NAME")
  OUT_FILE="$FRONTEND_ROOT/$TS_NAME.ts"

  echo "📡 Processing $SERVICE_NAME → $OUT_FILE"

  echo "// AUTO-GENERATED. DO NOT EDIT." > "$OUT_FILE"
  echo "// Bindings for $SERVICE_NAME" >> "$OUT_FILE"
  echo "" >> "$OUT_FILE"

  # Rust routes
  if compgen -G "$SERVICE_PATH/src/routes/*.rs" > /dev/null; then
    for ROUTE_FILE in "$SERVICE_PATH/src/routes/"*.rs; do
      extract_rust_routes "$SERVICE_NAME" "$ROUTE_FILE" | while read -r line; do
        method=$(echo "$line" | awk '{print $1}')
        path=$(echo "$line" | awk '{print $2}')
        fn=$(echo "$path" | sed 's/\//_/g' | sed 's/^_//' | sed 's/{//g' | sed 's/}//g')

        echo "export async function ${fn}_${method}() {" >> "$OUT_FILE"
        echo "  return fetch(\"/api/$TS_NAME$path\", { method: \"${method^^}\" }).then(r => r.json());" >> "$OUT_FILE"
        echo "}" >> "$OUT_FILE"
        echo "" >> "$OUT_FILE"
      done
    done
  fi

  # Python routes
  if compgen -G "$SERVICE_PATH/app/routers/*.py" > /dev/null; then
    for ROUTE_FILE in "$SERVICE_PATH/app/routers/"*.py; do
      extract_python_routes "$ROUTE_FILE" | while read -r method path; do
        fn=$(echo "$path" | sed 's/\//_/g' | sed 's/^_//' | sed 's/{//g' | sed 's/}//g')

        echo "export async function ${fn}_${method}() {" >> "$OUT_FILE"
        echo "  return fetch(\"/api/$TS_NAME$path\", { method: \"${method^^}\" }).then(r => r.json());" >> "$OUT_FILE"
        echo "}" >> "$OUT_FILE"
        echo "" >> "$OUT_FILE"
      done
    done
  fi

done

echo "✨ Service bindings generated successfully."

