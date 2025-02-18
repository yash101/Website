import toml from 'toml';
import probe from 'probe-image-size';
import { createMathjaxInstance, mathjax } from '@mdit/plugin-mathjax';
import { markdownitConfig, mathjaxConfig } from '../site-config.ts';
import markdownit from 'markdown-it';
import { full as emoji } from 'markdown-it-emoji';
import hljs from 'highlight.js';
import ConvertAnsiToHtml from 'ansi-to-html';

export class Prerenderer {
  constructor(notebook) {
    this.notebook = notebook;
    this.attachments = [];

    this.mathjax = createMathjaxInstance({
      ...mathjaxConfig,
    });

    this.markdownIt = markdownit({
      ...markdownitConfig,
      highlight: (str, lang) => {
        const language = lang || '';
        return this.syntaxHighlightCode(str, language).value
      },
    })
      .use(emoji)
      .use(mathjax, this.mathjax);
    
    this.convertAnsiToHtml = new ConvertAnsiToHtml({
      newline: true,
      escapeXML: true,
      stream: false,
    });
  }

  async prerender() {
    if (!this.notebook) {
      this.notebook = {};
    }

    this.notebook.cells = this.notebook.cells || [];
    this.notebook.metadata = this.notebook.metadata || {};
    this.notebook.metadata.img = {};

    if (this.notebook.cells.length < 2) {
      throw new Error('Compilation failed - Notebook is missing metadata and hero sections');
    }

    if (this.notebook.nbformat !== 4) {
      throw new Error('Compilation failed - Notebook nbformat version not supported, wanted 4, got ', this.notebook.metadata.nbformat);
    }

    const metadataCell = this.notebook.cells.shift();
    const metadata = await this.getMetadataFromFirstCell(metadataCell);
    metadata.publishedOn = new Date(metadata.publishedOn || '');
    metadata.lastModifiedOn = new Date(metadata.lastModifiedOn || '');

    this.notebook.metadata.pageinfo = {
      ...(this.notebook.metadata.pageinfo || {}),
      ...metadata
    };

    this.metadata = this.notebook.metadata.pageinfo;

    for (const cell of this.notebook.cells) {
      cell.source = (cell.source || [])
        .map(line => line.replace(/(\r\n|\r|\n)$/, ''))
        .join('\n') || '';

      for (const attachment of this.extractAttachments(cell.attachments || {})) {
        this.attachments.push(attachment);
        const { name, data, metadata } = attachment;

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
      renderers[cell.cell_type || 'raw'](cell);

      // GC unnecessary data
      delete cell.id;
      delete cell.execution_count;
      delete cell.attachments;
      delete cell.metadata;
    }

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
        throw new Error('Compilation failed - unknown format of metadata cell');
      }
    }
  }

  * extractAttachments(attachments) {
    for (const [ name, attachment ] of Object.entries(attachments)) {
      const mime = Object.keys(attachment)[0];
      const data = Buffer.from(attachment[mime], 'base64');
      const metadata = probe.sync(data);

      yield { name, data, metadata };
    }
  }

  rawRenderer(cell) {
  }

  mdRenderer(cell) {
    cell.source = this.markdownIt.render(cell.source);
  }

  codeRenderer(cell) {
    let language = '';
    try {
      language = this.metadata.language_info.name || this.notebook.metadata.kernelspec.name || '';
    } catch (__) { }

    const rendered = this.syntaxHighlightCode(cell.source || '', language);
    cell.source = rendered.code;
    cell.metadata = {
      ...(cell.metadata || {}),
      language: rendered.language,
    };
    cell.outputs = cell.outputs || [];

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
          code: `<pre><code class="hljs">${highlighted.value}</code></pre>`,
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
}
