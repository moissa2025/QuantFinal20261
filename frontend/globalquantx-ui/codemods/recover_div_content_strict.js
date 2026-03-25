/**
 * Strict div-block extractor:
 * - Finds the FIRST <div ...> block
 * - Walks forward counting nested <div> and </div>
 * - Stops when the block is balanced
 * - Safe even with corrupted JSX around it
 */

const fs = require("fs");
const path = require("path");

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;

  if (!file.path.includes(path.join("src", "pages"))) {
    return file.source;
  }

  const backupPath = file.path.replace(
    path.join("src", "pages"),
    path.join("backup_pages", "pages")
  );

  if (!fs.existsSync(backupPath)) {
    return file.source;
  }

  const src = fs.readFileSync(backupPath, "utf8");

  // Find first <div
  const start = src.indexOf("<div");
  if (start === -1) return file.source;

  // Walk forward to find matching </div>
  let depth = 0;
  let end = -1;

  const divOpen = /<div\b/gi;
  const divClose = /<\/div>/gi;

  // Collect all tag positions
  const tags = [];
  let m;

  while ((m = divOpen.exec(src))) tags.push({ pos: m.index, type: "open" });
  while ((m = divClose.exec(src))) tags.push({ pos: m.index, type: "close" });

  // Sort by position
  tags.sort((a, b) => a.pos - b.pos);

  // Walk through tags starting at the first <div
  let started = false;

  for (const t of tags) {
    if (t.pos === start) {
      started = true;
      depth = 1;
      continue;
    }
    if (!started) continue;

    if (t.type === "open") depth++;
    if (t.type === "close") depth--;

    if (depth === 0) {
      end = t.pos + "</div>".length;
      break;
    }
  }

  if (end === -1) return file.source;

  const extracted = src.slice(start, end).trim();

  // Inject into clean template
  const root = j(file.source);

  root.find(j.JSXElement).forEach(p => {
    const opening = p.value.openingElement;
    if (
      opening.name &&
      opening.name.type === "JSXIdentifier" &&
      opening.name.name === "section"
    ) {
      p.value.children = [
        j.jsxExpressionContainer(
          j.objectExpression([
            j.property(
              "init",
              j.identifier("dangerouslySetInnerHTML"),
              j.objectExpression([
                j.property(
                  "init",
                  j.identifier("__html"),
                  j.literal(extracted)
                )
              ])
            )
          ])
        )
      ];
    }
  });

  return root.toSource({ quote: "double" });
};

