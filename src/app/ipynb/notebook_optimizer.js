import probe from 'probe-image-size';
import toml from 'toml';

export async function optimizeNotebook(notebook) {
  const attachments = [];

  // cleanup
  if (!notebook)
    return null;
  notebook.cells = notebook.cells || [];
  notebook.metadata = notebook.metadata || {};
  notebook.metadata.img = {};

  // validation
  if (notebook.cells.length < 2)
    throw new Error('Notebook is missing metadata and hero sections');
  if (notebook.nbformat != 4)
    throw new Error('Only ipynbv4 is currently supported');

  // first two cells - first one is metadata, second is the hero post
  const metaCell = notebook.cells.shift();
  const heroCell = notebook.cells.shift();

  // actually process their data
  const metadata = toml.parse((metaCell.output || metaCell.source || []).join(''));
  const herodata = (heroCell.source || []).join('');

  metadata.published = new Date(metadata.published);
  metadata.lastModified = new Date(metadata.lastModified);

  // more validation
  if (!herodata)
    throw new Error('no hero content was provided');
  if (!metadata)
    throw new Error('no metadata was provided');

  // update the pageinfo metadata
  notebook.metadata.pageinfo = {
    ...(notebook.metadata.pageinfo || {}),
    ...metadata,
  };

  extractAttachments(heroCell.attachments || [])
    .forEach(attachment => attachments.push(attachment));

  // process and optimize each cell:
  // - concat lists of outputs into a single string
  // - remove fields we are unlikely to use
  // - extract and remove attachments
  // - get metadata for images
  for (const cell of notebook.cells) {
    delete cell.id;
    delete cell.execution_count;
    cell.source = (cell.source || [])
      .map(line => line.replace(/(\r\n|\r|\n)$/, ''))
      .join('\n') || '';
    
    // 1. add all the attachments to our attachments list
    // 2. drop attachments from the notebook itself
    // 3. add metadata for image into the notebook for faster rendering
    extractAttachments(cell.attachments || [])
      .forEach(attachment => attachments.push(attachment));
    delete cell.attachments;
    attachments.forEach(attachment => {
      if (attachment.meta === null)
        return;

      notebook.metadata.img[attachment.identifier] = {
        width: attachment.meta.width,
        height: attachment.meta.height,
      };
    });
  }

  return {
    nbOutput: notebook,
    attachments,
    hero: herodata,
  };
}

function extractAttachments(blob) {
  const attachments = Object
    .entries(blob)
    .map(([identifier, attachment]) => {
      const mime = Object.keys(attachment)[0];
      const data = Buffer.from(attachment[mime], 'base64');
      const meta = probe.sync(data);

      return {
        identifier,
        meta,
        data,
      };
    });

  return attachments;
}
