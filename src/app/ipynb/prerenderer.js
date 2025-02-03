import markdownit from "markdown-it";
import { full as emoji } from 'markdown-it-emoji';
import hljs from "highlight.js";
import { createMathjaxInstance, mathjax } from "@mdit/plugin-mathjax";
import ConvertAnsiToHtml from 'ansi-to-html';

import { markdownitConfig, mathjaxConfig } from '../../site-config.ts';

export class Prerenderer {
  constructor() {
    this.mathjaxInstance = createMathjaxInstance({
      ...mathjaxConfig,
    });

    this.md = markdownit({
      ...markdownitConfig,
      highlight: (str, lang) => this.highlight(str, lang),
    })
      .use(emoji)
      .use(mathjax, this.mathjaxInstance)
    
    this.convertAnsiToHtml = new ConvertAnsiToHtml({
      newline: true,
      escapeXML: true,
      stream: false,
    });

    this.attachments = [];
  }

  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs">${hljs.highlight(str, { language: lang, ignoreIllegals: true }).value}</code></pre>`;
      } catch (__) {
      }
    }
  
    return `<pre><code class="hljs">${this.md.utils.escapeHtml(str)}</code></pre>`;
  }

  renderMarkdown(notebook, cell) {
    cell.source = this.prerenderMarkdown(cell.source);
    return cell;
  }

  renderCodeblock(notebook, cell) {
    let language = null;
    try {
      language = notebook.metadata.language_info.name || notebook.metadata.kernelspec.name;
    } catch (__) { }
    const rendered = this.prerenderCodeBlockToHTML(cell.source || '', language);

    cell.source = rendered.code;
    cell.metadata = (cell.metadata || {});
    cell.metadata.language = language;
    cell.outputs = (cell.outputs || []);

    for (const output of cell.outputs) {
      if (output.output_type === 'error') {
        output.traceback = (output.traceback || [])
          .map(line => line.replace(/(\r\n|\r|\n)$/, ''))
          .map(line => this.convertAnsiToHtml.toHtml(line));
      } else if (output.output_type === 'stream'
        && ['stdout', 'stderr'].includes(output.name)) {
        output.text = (output.text || [])
          .map(line => line.replace(/(\r\n|\r|\n)$/, ''))
          .map(line => this.convertAnsiToHtml.toHtml(line));
      } else if (output.output_type === 'display_data') {
        // we will work on this later
      }
    }

    return cell;
  }

  prerender(notebook) {
    notebook.cells = (notebook.cells || [])
      .map(cell => {
        if (cell.cell_type === 'markdown') {
          return this.renderMarkdown(notebook, cell);
        } else if (cell.cell_type === 'code') {
          return this.renderCodeblock(notebook, cell);
        }

        return cell;
      });

    const mjxStyles = this.mathjaxInstance.outputStyle();
    if (mjxStyles) {
      const source = `
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

      notebook.cells.push({
        cell_type: 'markdown',
        source,
      });
    }

    return notebook;
  }

  prerenderMarkdown(markdown) {
    this.mathjaxInstance.reset();
    return this.md.render(markdown);
  }

  prerenderCodeBlockToHTML(codeblock, language) {
    if (language && hljs.getLanguage(language)) {
      try {
        const html = hljs.highlight(codeblock, { language: language, ignoreIllegals: true }).value;
        return {
          code: `<pre class="section-codeblock"><code class="hljs">${html}</code></pre>`,
          language,
        };
      } catch (e) {
        console.error(e);
      }
    }
    
    return {
      code: `<pre class="section-codeblock"><code class="hljs">${this.md.utils.escapeHtml(codeblock)}</code></pre>`,
      language,
    };
  }

  getAdditionalAttachments() {
    return this.attachments || [];
  }
}
