/**
 * Fallback Recovery Codemod (Option A)
 *
 * Extracts ONLY the first <div ...> ... </div> block from the corrupted backup file.
 * Does NOT parse JSX — safe even for catastrophic corruption.
 * Injects the extracted HTML into the clean template's <section>.
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
    path.join("backup_pages", "pages")
  );

  if (!fs.existsSync(backupPath)) {
    return file.source;
  }

  const backupSource = fs.readFileSync(backupPath, "utf8");

  // Extract the FIRST <div ...> ... </div> block
  const divStart = backupSource.indexOf("<div");
  const divEnd = backupSource.lastIndexOf("</div>");

  if (divStart === -1 || divEnd === -1) {
    return file.source; // nothing to recover
  }

  const extracted = backupSource.slice(divStart, divEnd + 6).trim();

  // Parse the clean template
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

  // Inject extracted HTML using dangerouslySetInnerHTML
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
              j.literal(extracted)
            )
          ])
        )
      ])
    )
  ];

  return root.toSource({ quote: "double", trailingComma: false });
};

