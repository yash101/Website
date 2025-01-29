import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';

const NOTEBOOKS_PATH = './notebooks';
const OUTPUT_PATH = './public/notebooks';
const ASSETS_BASE_PATH = './public/assets';
const INDEX_PATH = './public/notebooks.index.json';

async function buildAllNotebooks() {
  const notebooks = await getIpynbFiles(NOTEBOOKS_PATH);
  try {
    await fs.mkdir(OUTPUT_PATH);
    await fs.mkdir(ASSETS_BASE_PATH);
  } catch (error) {
    console.error(error);
  }
  console.log('Found notebooks:', notebooks);

  const index = {
    notebooks: [ ],
  };

  const notebooksPromises = notebooks.map(async notebook => {
    const notebookName = path.basename(notebook);
    const outputPath = path.join(OUTPUT_PATH, notebookName + '.json');
    console.log('Building:', notebook, '->', outputPath);

    const builtNotebook = await buildNotebook(notebook);

    for (const cell of builtNotebook.sections) {
      if (cell.type === 'markdown')
        cell.content = await marked.parse(cell.content);
    }

    const stringified = JSON.stringify({
      sections: builtNotebook.sections,
      meta: builtNotebook.metadata,
    }, null, 2);

    let promises = [];

    for (const [unused, value] of (builtNotebook.attachments || {})) {
      const item = Buffer.from(value['data'], 'base64');
      promises.push(fs.writeFile(path.join(ASSETS_BASE_PATH, value['identifier']), item));
    }

    index.notebooks.push({
      title: builtNotebook.metadata.title,
      author: builtNotebook.metadata.author,
      lastModified: builtNotebook.metadata.lastModified,
      published: builtNotebook.metadata.published,
      file: outputPath.substring('public'.length),
    });

    await fs.writeFile(outputPath, stringified);
    await Promise.all(promises);
  });

  await Promise.all(notebooksPromises);
  await fs.writeFile(INDEX_PATH, JSON.stringify(index, null, 2));
}

/**
 * Recursively get all .ipynb files from a given directory (asynchronously).
 * @param {string} dir - The directory to start from.
 * @returns {Promise<string[]>} - A promise that resolves to an array of file paths.
 */
async function getIpynbFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Recursively scan sub-directories
      const subFiles = await getIpynbFiles(filePath);
      results.push(...subFiles);
    } else if (filePath.endsWith('.ipynb') && !filePath.includes('.ipynb_checkpoints')) {
      results.push(filePath);
    }
  }

  return results;
}

async function buildNotebook(notebook) {
  const notebookFile = await fs.readFile(notebook, 'utf-8');
  const nb = JSON.parse(notebookFile);

  // Modify the notebook here
  if (nb.nbformat !== 4) {
    throw new Error('Only nbformat 4 is supported');
  }

  return await transformNotebookToSections(nb);
}

async function transformNotebookToSections(notebook) {
  const attachments = new Map();
  let metadata = null;

  const cells = (notebook.cells || [])
    .map(cell => {
      const source = (cell.source || []).join('');
      const outputs = (cell.outputs || [])
        .map(outputs => {
          return (outputs['text'] || []).join('');
        })
        .join('');

      for (const [identifier, attachment] of Object.entries(cell.attachments || {})) {
        const mime = Object.keys(attachment)[0];
        const data = attachment[mime];
        attachments.set(identifier, {
          identifier,
          data,
          mime,
        });
      }

      return { content: source, output: outputs, attachments, type: cell.cell_type };
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

  return { metadata, sections: cells, attachments};
}

(async () => {
  await buildAllNotebooks();
})();
