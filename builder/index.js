import { marked } from 'marked';

/*
Build process:
1. Parse notebook file
2. Generate HTML from notebook
3. Link the HTML together
 */

function generatePageFromNotebook(contents) {
  sections = [];
  current_section = null;
  for (cell of (contents.cells || [])) {
    if (cell.cell_type === 'raw') {
      if (current_section) {
        sections.push(current_section);
      }
      sections = [];
    }

    current_section.append(cell);
  }

  content = sections.map(section => {
    // Is the first cell raw? If so use it
    if (section[0].cell_type === 'raw') {
    }

    sections
      .filter(cell => cell.cell_type !== 'raw')
      .map(cell => {
        
      });
  });
}
