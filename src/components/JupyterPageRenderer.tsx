import { Notebook, NotebookSection } from 'jupyter/NotebookTransformer';
import React from 'react';
import JupyterHtmlSectionRenderer from './JupyterHtmlSectionRenderer';

interface JupyterPageRendererProps {
  notebook: Notebook;
}

/**
 * TODO: render the raw section
 * @param section raw section to render
 * @returns 
 */
function renderRawSection(section: NotebookSection) {
  // Render the raw section
  return null; // this will render embeds later on
}

function renderMarkdownSection(section: NotebookSection) {
  return (<section>
      <JupyterHtmlSectionRenderer html={section.content} />
    </section>);
}

function renderCodeSection(section: NotebookSection) {
}

const JupyterPageRenderer: React.FunctionComponent<JupyterPageRendererProps> = ({ notebook }) => {
  notebook
    .sections
    .map(section => {     // Render the section
      switch (section.type) {
        case 'raw':
          return renderRawSection(section);
        case 'markdown':
          return renderMarkdownSection(section);
        case 'code':
      }
    });
  return null;
}

export default JupyterPageRenderer;
