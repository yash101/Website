import toml from 'toml';
import probe from 'probe-image-size';
import hljs from 'highlight.js';

import markdownit from 'markdown-it';
import { createMathjaxInstance, mathjax, MathjaxInstance } from '@mdit/plugin-mathjax';
import { tab } from '@mdit/plugin-tab';
import { dl } from '@mdit/plugin-dl';
import { full as emoji } from 'markdown-it-emoji';
import { alert } from '@mdit/plugin-alert';
import { container } from '@mdit/plugin-container';

import { markdownitConfig, mathjaxConfig } from '../site-config.js';
import ConvertAnsiToHtml from 'ansi-to-html';
import { NotebookUnderTransformation, NUTAttachment } from './types-internal.js';
import { PageInfo } from './types.js';

export class Prerenderer {
  notebook: NotebookUnderTransformation;
  attachments: NUTAttachment[];
  mathjax: MathjaxInstance;
  markdownIt: ReturnType<typeof markdownit>;
  convertAnsiToHtml: ConvertAnsiToHtml;
  metadata: object;

  constructor(notebook: unknown) {
    this.notebook = notebook;
    this.attachments = [];

    this.mathjax = createMathjaxInstance({
      ...mathjaxConfig,
    });

    this.markdownIt = markdownit({
      ...markdownitConfig,
      highlight: (str, lang) => {
        const language = lang || '';
        return this.syntaxHighlightCode(str, language).code;
      },
    })
      .use(emoji)
      .use(mathjax, this.mathjax)
      .use(tab, {
        name: 'tabs',
      })
      .use(dl)
      .use(alert)
      .use(container, {
        name: 'warning',
      });
    
    this.convertAnsiToHtml = new ConvertAnsiToHtml({
      newline: true,
      escapeXML: true,
      stream: false,
    });
  }

  async prerender() {
    this.notebook.cells = this.notebook.cells || [];
    this.notebook.metadata = this.notebook.metadata || {};
    this.notebook.metadata.img = {};

    if (this.notebook.cells.length < 2) {
      throw new Error('Compilation failed - Notebook is missing metadata and hero sections');
    }

    if (this.notebook.nbformat !== 4) {
      throw new Error('Compilation failed - Notebook nbformat version not supported, wanted 4, got ' + this.notebook.metadata.nbformat);
    }

    delete this.notebook.nbformat;
    delete this.notebook.nbformat_minor;

    const metadataCell = this.notebook.cells.shift();
    const metadata = await this.getMetadataFromFirstCell(metadataCell);
    metadata.publishedOn = new Date(metadata.publishedOn || '');
    metadata.lastModifiedOn = new Date(metadata.lastModifiedOn || '');

    this.notebook.metadata.pageinfo = {
      ...(this.notebook.metadata?.pageinfo as object || {}),
      ...metadata
    };

    this.metadata = this.notebook.metadata.pageinfo as PageInfo;

    for (const cell of this.notebook.cells) {
      cell.source = Array.isArray(cell.source) ? cell.source : [cell.source || ''];
      cell.props = this.magic(cell).props;

      cell.source = cell.source 
        .map(line => line.replace(/(\r\n|\r|\n)$/, ''))
        .join('\n') || '';

      for (const attachment of this.extractAttachments(cell.attachments || {})) {
        this.attachments.push(attachment);
        const {
          name,
          metadata
        } = attachment;

        if (metadata) {
          this.notebook.metadata.img[name] = {
            width: metadata.width,
            height: metadata.height,
          };
        }
      }

      const renderers = {
        raw: cell => this.rawRenderer(cell),
        markdown: cell => this.mdRenderer(cell),
        code: cell => this.codeRenderer(cell),
      };

      // prerender the cell
      renderers[cell.cell_type || 'markdown'](cell);
    }

    // GC loop (hidden cells & unnecessary data)
    this.notebook.cells = this.notebook.cells
      .filter(cell => !cell.props?.hidden)
      .map(cell => {
        // GC unnecessary data
        delete cell.id;
        delete cell.execution_count;
        delete cell.attachments;
        delete cell.metadata;

        return cell;
      });

    // TODO: experiment if moving custom CSS rules to after {mjxStyles} improves the rendering
    const mjxStyles = this.mathjax.outputStyle();
    this.notebook.additionalRawHtml = `
<style type="text/css">
mjx-container[jax="SVG"] > svg {
  display: inline;
  z-index: 0;
  max-width: 100%;
  overflow-x: auto;
}
${mjxStyles}
</style>
    `;

    // **** Disable these lines if you want to keep the kernel and language info in the metadata ****
    // GC unnecessary data
    delete this.notebook.metadata.kernelspec;
    delete this.notebook.metadata.language_info;
  }

  async getMetadataFromFirstCell(cell) {
    // Normalize line endings
    const text = (cell.output || cell.source || [])
      .map(line => line.replace(/(\r\n|\r|\n)$/, ''))
      .join('\n');

    try {
      return JSON.parse(text);
    } catch (e) {
      try {
        return toml.parse(text);
      } catch (e) {
        try {
          return new Function(`return ${text}`)();
        } catch (e) {
          throw new Error('Compilation failed - unknown format of metadata cell - ' + e.message);
        }
      }
    }
  }

  * extractAttachments(attachments): Generator<NUTAttachment> {
    for (const [ name, attachment ] of Object.entries(attachments)) {
      const mime = Object.keys(attachment)[0];
      const data = Buffer.from(attachment[mime], 'base64');
      const metadata = probe.sync(data);

      yield { name, data, metadata };
    }
  }

  rawRenderer(cell) {
    return;
  }

  mdRenderer(cell) {
    cell.source = this.markdownIt.render(cell.source);
  }

  codeRenderer(cell) {
    if (cell.props?.hidecode !== true) {
      let language = '';
      try {
        language = this.notebook.metadata.lang ||
          this.metadata['language_info'].name ||
          this.notebook.metadata['kernelspec']['name'] || '';
      } catch (__) { }

      if (!this.notebook.metadata.lang) {
        this.notebook.metadata.lang = language;
      }

      const rendered = this.syntaxHighlightCode(cell.source || '', language);
      cell.source = rendered.code;

      cell.metadata = {
        ...(cell.metadata || {}),
        language: rendered.language,
      };
    } else {
      cell.source = null;
    }

    cell.outputs = cell.outputs || [];
    if (cell.props?.hideoutput === true) {
      cell.outputs = [];
    }

    for (const output of cell.outputs) {
      if (output.output_type === 'error') {
        output.traceback = (output.traceback || [])
          .map(line => line.replace(/(\r\n|\r|\n)$/, ''))
          .map(line => this.convertAnsiToHtml.toHtml(line));
      } else if (output.output_type === 'stream') {
        output.text = (output.text || [])
          .map(line => line.replace(/(\r\n|\r|\n)$/, ''))
          .map(line => this.convertAnsiToHtml.toHtml(line));
      }
    }
  }

  syntaxHighlightCode(str, lang) {
    try {
      const language = lang && hljs.getLanguage(lang) ? lang : null;
      if (language) {
        const highlighted = hljs.highlight(str, {
          language: lang,
          ignoreIllegals: true
        });

        return {
          code: `<pre><code class="hljs text-sm">${highlighted.value}</code></pre>`,
          language
        };
      }
    } catch (__) { }

    return {
      code: `<pre><code class="hljs">${this.markdownIt.utils.escapeHtml(str)}</code></pre>`,
      language: lang || ''
    };
  }

  getNotebook() {
    return this.notebook;
  }

  getAttachments() {
    return this.attachments;
  }

  getHeroSection() {
    return (this.notebook.cells[0] || {}).source || '';
  }

  magic(cell) {
    // extract magics
    const magics = new Set();
    for (const line of cell.source) {
      // Match '#%... ' or '//%...'
      if (line.match(/^(#%|\/\/%)/)) {
        magics.add(line.replace(/^(#%|\/\/%)/, '').trim());
        cell.source.shift();
      } else {
        break;
      }
    }

    return {
      rawMagic: magics,
      props: {
        hidden: magics.has('hidden') || magics.has('delete'),
        hidecode: magics.has('hidecode'),
        hideoutput: magics.has('hideoutput'),
      },
    };
  }
}
