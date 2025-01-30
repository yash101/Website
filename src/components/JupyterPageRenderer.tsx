import React from 'react';
import JupyterHtmlSectionRenderer from './JupyterHtmlSectionRenderer';
import { Notebook, NotebookCell } from 'app/ipynb/notebook';

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
  // Render the raw section
  return null; // this will render embeds later on
}

function renderMarkdownSection(section: NotebookCell, notebook: Notebook) {
  return (
    <section className='mb-[2em] nbsection'>
      <JupyterHtmlSectionRenderer html={section.source || ''} notebook={notebook} />
    </section>
  );
}

function renderCodeSection(section: NotebookCell, notebook: Notebook) {
  console.log('ignoring section', section);
  return null;
}

const JupyterPageRenderer: React.FunctionComponent<JupyterPageRendererProps> = ({ notebook }) => {
  return (notebook.cells || [])
    .map(section => {     // Render the section
      switch (section.cell_type) {
        case 'raw':
          return renderRawSection(section, notebook);
        case 'markdown':
          return renderMarkdownSection(section, notebook);
        case 'code':
          return renderCodeSection(section, notebook);
      }
    });
}

export default JupyterPageRenderer;
