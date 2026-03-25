/**
 * Codemod: Recover full HTML content from backup_pages into clean templates.
 *
 * This codemod:
 *  - Reads the original broken file from backup_pages/
 *  - Extracts ALL inner HTML (h1, h2, p, div, lists, etc.)
 *  - Injects it directly into <section> of the clean template
 *  - Preserves structure exactly as-is (institutional-grade)
 *
 * Requirements:
 *  - backup_pages/ must contain the original files
 *  - src/pages/ must contain the cleaned Option A templates
 */

const fs = require("fs");
const path = require("path");

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;

  // Only operate on src/pages
  if (!file.path.includes(path.join("src", "pages"))) {
    return file.source;
  }

  // Compute backup path
  const backupPath = file.path.replace(
    path.join("src", "pages"),
    path.join("backup_pages")
  );

  if (!fs.existsSync(backupPath)) {
    return file.source;
  }

  const backupSource = fs.readFileSync(backupPath, "utf8");

  // Extract everything inside the return (...) block of the backup file
  // We do NOT parse JSX — we extract raw HTML-like content safely.
  const match = backupSource.match(/return\s*\([\s\S]*?\);/);

  if (!match) {
    return file.source;
  }

  const rawBlock = match[0];

  // Remove "return (" and ");"
  let inner = rawBlock
    .replace(/return\s*\(/, "")
    .replace(/\);\s*$/, "")
    .trim();

  // Remove stray closing tags that were part of the corruption
  inner = inner.replace(/<\/DockablePanel>/g, "");
  inner = inner.replace(/<\/Page>/g, "");

  // Clean up indentation
  inner = inner.split("\n").map(l => l.trim()).join("\n");

  // Now parse the current clean file
  const root = j(file.source);

  // Find <section>
  let sectionNode = null;

  root.find(j.JSXElement).forEach(p => {
    const opening = p.value.openingElement;
    if (
      opening.name &&
      opening.name.type === "JSXIdentifier" &&
      opening.name.name === "section"
    ) {
      sectionNode = p.value;
    }
  });

  if (!sectionNode) {
    return file.source;
  }

  // Inject raw HTML using dangerouslySetInnerHTML
  sectionNode.children = [
    j.jsxExpressionContainer(
      j.objectExpression([
        j.property(
          "init",
          j.identifier("dangerouslySetInnerHTML"),
          j.objectExpression([
            j.property(
              "init",
              j.identifier("__html"),
              j.literal(inner)
            )
          ])
        )
      ])
    )
  ];

  return root.toSource({ quote: "double", trailingComma: false });
};

