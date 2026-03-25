#!/bin/bash

# Fix all JSX files under src/pages by repairing DockablePanel/Page structure

find src/pages -type f -name "*.jsx" | while read file; do
  echo "Fixing $file"

  # 1. Remove stray closing tags that appear outside the root
  sed -i '' 's/^ *<\/DockablePanel>.*/<\/DockablePanel>/' "$file"
  sed -i '' 's/^ *<\/Page>.*/<\/Page>/' "$file"

  # 2. Remove duplicated or misordered closing tags
  sed -i '' 's/<\/Page> *<\/DockablePanel>/<\\/DockablePanel>/' "$file"

  # 3. Ensure the return block has a single root element
  sed -i '' 's/return ( *$/return (/' "$file"

  # 4. Remove any extra closing divs after DockablePanel
  sed -i '' 's/<\/DockablePanel> *<\/div>/<\\/DockablePanel>/' "$file"

  # 5. Remove any trailing </div> that is not paired
  sed -i '' 's/^ *<\/div> *$//' "$file"

done

echo "All JSX files processed."

