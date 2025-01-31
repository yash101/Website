import React from 'react';
import JupyterHtmlSectionRenderer from './JupyterHtmlSectionRenderer';
import { Notebook, NotebookCell } from 'app/ipynb/notebook';
import JupyterCodeCellRenderer from './JupyterCodeCellRenderer';

interface JupyterPageRendererProps {
  notebook: Notebook;
}

/**
 * TODO: render the raw section
 * @param section raw section to render
 * @returns 
 */
function renderRawSection(section: NotebookCell, notebook: Notebook) {
  console.log('ignoring section', section);
  return null; // TODO: implement
}

function renderMarkdownSection(section: NotebookCell, notebook: Notebook) {
  return (
    <section className='my-[0.5em] nbsection'>
      <JupyterHtmlSectionRenderer html={section.source || ''} notebook={notebook} />
    </section>
  );
}

function renderCodeSection(section: NotebookCell, notebook: Notebook) {
  return (
    <section className='codeblock border border-slate-950 bg-slate-100 p-[1em] my-[0.5em] dark:border-slate-50 dark:bg-slate-900 block'>
      <JupyterCodeCellRenderer notebook={notebook} cell={section} />
    </section>
  )
}

const JupyterPageRenderer: React.FunctionComponent<JupyterPageRendererProps> = ({ notebook }) => {
  return (notebook.cells || [])
    .map(section => {
      switch (section.cell_type) {
        case 'raw':
          return renderRawSection(section, notebook);
        case 'markdown':
          return renderMarkdownSection(section, notebook);
        case 'code':
          return renderCodeSection(section, notebook);
        default:
          return null;
      }
    })
    .filter(section => section !== null);
}

export default JupyterPageRenderer;
