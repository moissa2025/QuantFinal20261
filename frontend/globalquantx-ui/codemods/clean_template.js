/**
 * CLEAN TEMPLATE CODEMOD (Option A)
 *
 * This codemod:
 *  - Does NOT parse the file (safe for corrupted JSX)
 *  - Extracts the component name from the filename
 *  - Replaces the entire file with a clean institutional-grade template
 *  - Only includes DockablePanel + Page imports
 *  - Prepares the file for the recovery codemod
 */

const path = require("path");

module.exports = function transformer(file, api) {
  const j = api.jscodeshift;

  // Only operate on src/pages
  if (!file.path.includes(path.join("src", "pages"))) {
    return file.source;
  }

  // Extract component name from filename
  const fileName = path.basename(file.path, ".jsx");
  const componentName = fileName.replace(/[^a-zA-Z0-9]/g, "");

  // Build clean template
  const clean = `
    import DockablePanel from "../../layout/DockablePanel.jsx";
    import Page from "../../layout/Page.jsx";

    export default function ${componentName}() {
      return (
        <DockablePanel title="${componentName}">
          <Page>
            <section>
              {/* content will be restored by recovery codemod */}
            </section>
          </Page>
        </DockablePanel>
      );
    }
  `;

  return clean;
};

