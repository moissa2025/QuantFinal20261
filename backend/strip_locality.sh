#!/usr/bin/env bash

INPUT="schema_final.sql"
OUTPUT="schema_final_clean.sql"

# Remove all LOCALITY clauses (case-insensitive)
sed -E 's/LOCALITY[[:space:]]+[^;]+;//Ig' "$INPUT" > "$OUTPUT"

echo "Created $OUTPUT without LOCALITY clauses."

