import { marked } from "marked";

export async function prerender(notebook) {
  notebook.cells = await Promise.all((notebook.cells || [])
    .map(async cell => {
    if (cell.cell_type === 'markdown') {
      cell.source = await marked.parse(cell.source);
    }

    return cell;
  }));

  return notebook;
}

export async function prerenderMarkdown(markdown) {
  return await marked.parse(markdown);
}
