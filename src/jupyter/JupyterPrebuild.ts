import fs from 'fs/promises';
import path from 'path';
import { JupyterNotebook } from './JupyterNotebookDefinitions';
import transformNotebook, { Notebook, NotebookAttachment, NotebookSection } from './NotebookTransformer';
import { marked } from 'marked';

const NOTEBOOKS_PATH = '../notebooks';
const OUTPUT_PATH = '../notebooks.build';
const ASSETS_BASE_PATH = '/';

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
