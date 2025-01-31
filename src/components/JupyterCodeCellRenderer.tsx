import { Notebook, NotebookCell } from 'app/ipynb/notebook';
import React from 'react';

interface CodeCellRendererProps {
  cell: NotebookCell;
  notebook: Notebook;
}

export const JupyterCodeCellRenderer: React.FC<CodeCellRendererProps> = ({ cell, notebook }) => {
  return (
    <div>
      <section className="code" dangerouslySetInnerHTML={{ __html: cell.source }}></section>
    </div>
  );
};

export default JupyterCodeCellRenderer;
