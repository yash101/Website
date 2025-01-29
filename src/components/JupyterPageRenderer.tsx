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
function renderRawSection(section: NotebookCell) {
  console.log('ignoring section', section);
  // Render the raw section
  return null; // this will render embeds later on
}

function renderMarkdownSection(section: NotebookCell) {
  return (
    <section>
      <JupyterHtmlSectionRenderer html={section.source || ''} />
    </section>
  );
}

const JupyterPageRenderer: React.FunctionComponent<JupyterPageRendererProps> = ({ notebook }) => {
  return (notebook.cells || [])
    .map(section => {     // Render the section
      switch (section.cell_type) {
        case 'raw':
          return renderRawSection(section);
        case 'markdown':
          return renderMarkdownSection(section);
        case 'code':
          return null;
      }
    });
}

export default JupyterPageRenderer;
