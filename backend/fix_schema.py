import re

with open("schema_final.sql", "r") as f:
    sql = f.read()

# 1. Remove LOCALITY clauses
sql = re.sub(
    r"LOCALITY\s+[^;]+;",
    ";",
    sql,
    flags=re.IGNORECASE | re.MULTILINE
)

# 2. Fix cases where LOCALITY removal leaves a bare ')'
# Replace:
#   ")\nCREATE TABLE"
# with:
#   ");\nCREATE TABLE"
sql = re.sub(
    r"\)\s*\n\s*CREATE TABLE",
    r");\nCREATE TABLE",
    sql,
    flags=re.MULTILINE
)

# 3. Ensure every CREATE TABLE block ends with a semicolon
# If a CREATE TABLE ends with ")\n", add ";"
sql = re.sub(
    r"\)\s*\n(?=CREATE TABLE|$)",
    r");\n",
    sql,
    flags=re.MULTILINE
)

# 4. Remove double semicolons
sql = re.sub(r";+", ";", sql)

with open("schema_final_clean.sql", "w") as f:
    f.write(sql)

print("Created schema_final_clean.sql with LOCALITY removed and structure repaired.")

