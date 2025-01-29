import React from 'react';
import JupyterHtmlSectionRenderer from './JupyterHtmlSectionRenderer';
import { NotebookContainer, NotebookSection } from 'jupyter/JupyterTypes';

interface JupyterPageRendererProps {
  notebook: NotebookContainer;
}

/**
 * TODO: render the raw section
 * @param section raw section to render
 * @returns 
 */
function renderRawSection(section: NotebookSection) {
  console.log('ignoring section', section);
  // Render the raw section
  return null; // this will render embeds later on
}

function renderMarkdownSection(section: NotebookSection) {
  return (
    <section>
      <JupyterHtmlSectionRenderer html={section.content || ''} />
    </section>
  );
}

const JupyterPageRenderer: React.FunctionComponent<JupyterPageRendererProps> = ({ notebook }) => {
  return (notebook.sections)
    .map(section => {     // Render the section
      switch (section['type'] as string) {
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
