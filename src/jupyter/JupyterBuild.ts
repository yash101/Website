const fs = require('fs/promises');
const path = require('path');
const { marked } = require('marked');

const NOTEBOOKS_PATH = '../notebooks';
const OUTPUT_PATH = '../notebooks.build';
const ASSETS_BASE_PATH = '/';

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

export interface JupyterMetadata {
  [key: string]: any;
}

export interface JupyterAttachments {
  [key: string]: { [mime: string]: string };
}

export interface PageMetadata {
  title: string;
  lastModified: Date;
  initialPublish: Date;
}

export interface JupyterCell {
  cell_type: string;
  source: string[];
  metadata?: JupyterMetadata;
  execution_count?: number;
  outputs: string[];
  attachments?: JupyterAttachments;

  [key: string]: any;
}

export interface JupyterNotebook {
  cells?: JupyterCell[];
  metadata: JupyterMetadata;
  nbformat: number;
  nbformat_minor: number;

  [key: string]: any;
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

/**
 * Recursively get all .ipynb files from a given directory (asynchronously).
 * @param {string} dir - The directory to start from.
 * @returns {Promise<string[]>} - A promise that resolves to an array of file paths.
 */
async function getIpynbFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively scan sub-directories
      const subFiles = await getIpynbFiles(filePath);
      results.push(...subFiles);
    } else if (filePath.endsWith('.ipynb')) {
      results.push(filePath);
    }
  }

  return results;
}

async function buildNotebook(notebook: string) {
  const notebookFile: string = await fs.readFile(notebook, 'utf-8');
  const nb: JupyterNotebook = JSON.parse(notebookFile);

  // Modify the notebook here
  if (nb.nbformat !== 4) {
    throw new Error('Only nbformat 4 is supported');
  }

  return transformNotebook(nb);
}

async function buildAllNotebooks() {
  const notebooks = await getIpynbFiles(NOTEBOOKS_PATH);
  fs.mkdir(OUTPUT_PATH);
  console.log('Found notebooks:', notebooks);

  for (const notebook of notebooks) {
    const notebookName = path.basename(notebook);
    const outputPath = path.join(OUTPUT_PATH, notebookName);
    console.log('Building:', notebook, '->', outputPath);

    const builtNotebook: Notebook = await buildNotebook(notebook);

    for (const cell of builtNotebook.sections) {
      if (cell.type === 'markdown')
        cell.content = await marked.parse(cell.content);
    }

    const stringified: string = JSON.stringify({
      sections: builtNotebook.sections,
      meta: builtNotebook.metadata,
    }, null, 2);

    let promises = [
      fs.writeFile(outputPath, stringified),
      builtNotebook
        .attachments
        .entries()
        .map((key, value) => {
          console.log(key, value);
          return new Promise(promise => { promise(null); });
        }),
    ];
  }
}

(async () => {
  await buildAllNotebooks();
})();
