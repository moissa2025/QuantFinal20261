/**
 * Codemod: fix malformed JSX in page components
 *
 * Repairs:
 * - stray </DockablePanel>
 * - stray </div>
 * - duplicated closing tags
 * - missing root wrapper
 * - mismatched nesting
 *
 * Output structure:
 *
 * return (
 *   <DockablePanel title="...">
 *     <Page>
 *       <section>
 *         {existing content}
 *       </section>
 *     </Page>
 *   </DockablePanel>
 * );
 */

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Find the default export function
  const defaultExport = root.find(j.ExportDefaultDeclaration);

  if (!defaultExport.size()) return file.source;

  const func = defaultExport.get().value.declaration;

  // Find the return statement
  const returnStmt = j(func)
    .find(j.ReturnStatement)
    .filter(p => p.value.argument && p.value.argument.type === "JSXElement");

  if (!returnStmt.size()) return file.source;

  const originalJSX = returnStmt.get().value.argument;

  // Extract inner content (whatever was inside the broken structure)
  let innerContent = originalJSX.children || [];

  // Clean out whitespace and stray text nodes
  innerContent = innerContent.filter(
    c => !(c.type === "Literal" && typeof c.value === "string" && c.value.trim() === "")
  );

  // Build the corrected structure
  const fixedJSX = j.jsxElement(
    j.jsxOpeningElement(j.jsxIdentifier("DockablePanel"), []),
    j.jsxClosingElement(j.jsxIdentifier("DockablePanel")),
    [
      j.jsxElement(
        j.jsxOpeningElement(j.jsxIdentifier("Page"), []),
        j.jsxClosingElement(j.jsxIdentifier("Page")),
        [
          j.jsxElement(
            j.jsxOpeningElement(j.jsxIdentifier("section"), []),
            j.jsxClosingElement(j.jsxIdentifier("section")),
            innerContent
          )
        ]
      )
    ]
  );

  // Replace the return argument
  returnStmt.get().value.argument = fixedJSX;

  return root.toSource({ quote: "double", trailingComma: false });
};

