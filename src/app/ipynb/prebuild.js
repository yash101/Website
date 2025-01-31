import fs from 'fs/promises';
import path from 'path';
import { findFilesRecursively, ensureDirectoryExists } from './fs_utils.js';
import { optimizeNotebook } from './notebook_optimizer.js';
import { Prerenderer } from './prerenderer.js';

const NOTEBOOKS_PATH = path.join(process.cwd(), 'notebooks');
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const OUTPUT_DIR_PATH = path.join(process.cwd(), 'public', 'ipynb_pp');
const ASSETS_DIR_PATH = path.join(process.cwd(), 'public', 'assets');

async function run() {
  await ensureDirectoryExists(NOTEBOOKS_PATH);
  await ensureDirectoryExists(OUTPUT_DIR_PATH);
  await ensureDirectoryExists(ASSETS_DIR_PATH);

  const index = {
    notebooks: [],
  };

  // Find the jupyter notebooks
  const notebooksPromises = (await findFilesRecursively(NOTEBOOKS_PATH) || [])
    .filter(file => file.match(/.ipynb$/) && !file.includes('.ipynb_checkpoints'))
    .map(async nbInputPath => {
      // Determine output paths
      const nbOutputPath = path.join(
        OUTPUT_DIR_PATH, path.relative(NOTEBOOKS_PATH, nbInputPath.replace(/.ipynb$/, '.dnb')));
      const nbOutputDir = path.dirname(nbOutputPath);
      try {
          await ensureDirectoryExists(nbOutputDir);

        // Preprocess the jupyter notebook
        const nbInputFile = await fs.readFile(nbInputPath, 'utf8');
        const nbInput = JSON.parse(nbInputFile);

        const {
          nbOutput,
          attachments,
          hero
        } = await optimizeNotebook(nbInput);

        const prerender = new Prerenderer();

        const renderedNotebook = prerender.prerender(nbOutput);
        const renderedHero = prerender.prerenderMarkdown(hero);

        index.notebooks.push({
          ...renderedNotebook.metadata.pageinfo,
          renderedHero,
          slug: renderedNotebook.metadata.slug || path.basename(nbInputPath.replace(/.ipynb$/, '')),
          file: path.relative(PUBLIC_DIR, nbOutputPath),
        });

        await Promise.all([
          fs.writeFile(nbOutputPath, JSON.stringify(renderedNotebook, null, 2)),
          writeAttachments(attachments),
        ]);
      } catch (e) {
        console.error(`Error while processing ${nbInputPath}: `, e);
      }
    });

  const notebooks = await Promise.all(notebooksPromises);
  index.notebooks.sort((a, b) => {
    return b.published - a.published;
  });
  await fs.writeFile(path.join(PUBLIC_DIR, 'ipynb_index.json'), JSON.stringify(index));
}

async function writeAttachments(attachments) {
  for (const attachment of (attachments || [])) {
    const finalPath = path.join(ASSETS_DIR_PATH, attachment.identifier);
    await fs.writeFile(finalPath, attachment.data);
  }
}

(async () => {
  run()
})()
  .catch(e => console.error(e));
