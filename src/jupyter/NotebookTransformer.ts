import { JupyterNotebook } from "./JupyterNotebookDefinitions";

export interface NotebookMetadata {
  title: string;
  author: string;
  lastModified: Date;
  published: Date;
}

export interface NotebookSection {
  content: string;
  output: string;
  type: string;
}

interface Notebook {
  metadata: NotebookMetadata;
  sections: NotebookSection[];
  attachments: Map<string, NotebookAttachment>;
}

interface NotebookAttachment {
  identifier: string;
  data: string;
  mime: string;
}

async function transformNotebook(notebook: JupyterNotebook): Promise<Notebook> {
  const sections: NotebookSection[] = [];
  const attachments: Map<string, NotebookAttachment> = new Map();
  let metadata: NotebookMetadata | null = null;

  const cells: NotebookSection[] = (notebook.cells || [])
    .map(cell => {
      const source = (cell.source || []).join('');
      const outputs = (cell.outputs || []).join('');

      for (const [identifier, attachment] of Object.entries(cell.attachments || {})) {
        const mime: string = Object.keys(attachment)[0];
        const data: string = attachment[mime];
        attachments.set(identifier, {
          identifier,
          data,
          mime,
        });
      }

      return { content: source, output: outputs, type: cell.cell_type };
    });

  // Extract notebook metadata from a raw cell
  // Notebook metadata is json, with a field "role" set to "metadata"
  for (const cell of cells.filter(cell => cell.type === 'raw')) {
    try {
      const parsed = JSON.parse(cell.content);
      if ((parsed.role || '') === 'metadata') {
        metadata = {
          title: parsed.title,
          lastModified: new Date(parsed.lastModified),
          published: new Date(parsed.published),
          author: parsed.author,
        };
      }
    } catch (e) {
      console.error('Error parsing raw cell:', e);
    }
  }

  if (!metadata) {
    throw new Error(`Notebook metadata not found`);
  }

  return { metadata, sections, attachments};
}

export default transformNotebook;
export type { Notebook, NotebookAttachment };
