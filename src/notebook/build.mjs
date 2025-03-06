import fs from 'fs/promises';
import path from 'path';

import { ensureDirectoryExists, findFiles } from "./FileSystemUtils.ts";
import { Prerenderer } from "./Prerenderer.ts";
import { Indexer } from './Indexer.mjs';

const NOTEBOOKS_PATH = path.join(process.cwd(), 'notebooks');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OUTPUT_DIR_PATH = path.join(PUBLIC_DIR, 'notebooks');
const ASSETS_DIR_PATH = path.join(PUBLIC_DIR, 'assets');
const ATTACHMENTS_DIR_PATH = path.join(ASSETS_DIR_PATH, 'attachments');
const OBJECTS_DIR_PATH = path.join(ASSETS_DIR_PATH, 'objects');
const INDICES_DIR_PATH = path.join(PUBLIC_DIR, 'indices');

const DEBUG_INDENT_JSON = 0;

async function processNotebook(filepath, indexer) {
  // guard clauses for the files we should process here
  if (filepath.includes('.ipynb_checkpoints') || !filepath.endsWith('.ipynb') || filepath.startsWith('.')) {
    return;
  }

  // Determine output paths
  const nbOutputPath = path.join(OUTPUT_DIR_PATH,
    path.relative(NOTEBOOKS_PATH, filepath.replace(/.ipynb$/, '.nb')));
  console.log(`🔨build ${filepath}`);

  try {
    await ensureDirectoryExists(path.dirname(nbOutputPath));

    const ipynbRawText = await fs.readFile(filepath, 'utf8');
    const ipynb = JSON.parse(ipynbRawText);

    const prerenderer = new Prerenderer(ipynb);
    await prerenderer.prerender();
    const notebook = prerenderer.getNotebook();

    const notebookFileWritePromise = fs.writeFile(nbOutputPath, JSON.stringify(notebook, null, DEBUG_INDENT_JSON));
    const attachmentWriterPromise = Promise.all(prerenderer
      .getAttachments()
      .map(async attachment => {
        const { name, data } = attachment;
        const attachmentPath = path.join(ATTACHMENTS_DIR_PATH, name);
        await fs.writeFile(attachmentPath, data);
      }));

    indexer.addNotebook({
      notebook,
      path: path.relative(PUBLIC_DIR, nbOutputPath)
    });

    await Promise.all([
      notebookFileWritePromise,
      attachmentWriterPromise
    ]);
  } catch (e) {
    console.error(`Compilation failed for ${filepath}: ${e.message}\n${e.stack}`);
  }
}

async function copyResource(source) {
  const filename = path.basename(source);
  // guard clauses for the files we should process here
  if (filename.endsWith('.ipynb') ||
    source.includes('.ipynb_checkpoints') ||
    filename.match(/^(\.|\_)/)) {
    return;
  }

  const destination = path.join(OBJECTS_DIR_PATH, path.relative(NOTEBOOKS_PATH, source));
  await ensureDirectoryExists(path.dirname(destination));
  console.log(`🗃️ cp ${source} => ${path.relative(PUBLIC_DIR, destination)}`);

  await fs.copyFile(source, destination);
}

(async function build() {
  await ensureDirectoryExists(NOTEBOOKS_PATH);
  await ensureDirectoryExists(OUTPUT_DIR_PATH);
  await ensureDirectoryExists(ASSETS_DIR_PATH);
  await ensureDirectoryExists(ATTACHMENTS_DIR_PATH);
  await ensureDirectoryExists(INDICES_DIR_PATH);

  const siteStructure = fs
    .readFile(path.join(NOTEBOOKS_PATH, '_site-structure.json'), 'utf8')
    .then(JSON.parse);

  const indexer = new Indexer();

  const builders = [
    (filename) => processNotebook(filename, indexer),
    copyResource,
  ];

  for await (const filename of findFiles(NOTEBOOKS_PATH)) {
    for (const builder of builders) {
      await builder(filename);
    }
  }

  indexer.setSiteStructure(await siteStructure);
  indexer.generateIndex();
  const index = indexer.getIndex();
  const names = index.names || {};
  const indices = Object
    .entries(index.indices || {})
    .map(([key, value]) => {
      return {
        filename: names[key],
        value
      };
    });
  
  const indexPath = path.join(PUBLIC_DIR, 'index.json');

  const promises = [
    ...indices.map(index => {
      const destination = path.join(INDICES_DIR_PATH, index.filename);
      return fs.writeFile(destination, JSON.stringify(index.value, null, DEBUG_INDENT_JSON));
    }),
    fs.writeFile(indexPath, JSON.stringify(names, null, DEBUG_INDENT_JSON)),
  ];

  await Promise.all(promises);
})();
