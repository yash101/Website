import { Notebook, NotebookCell } from 'app/ipynb/notebook';
import React from 'react';
import { AnsiDisplay } from './AnsiDisplay';

interface CodeCellRendererProps {
  cell: NotebookCell;
  notebook: Notebook;
}

export const JupyterCodeCellRenderer: React.FC<CodeCellRendererProps> = ({ cell, notebook }) => {
  const consoleOutputs = [];

  (cell.outputs || [])
    .filter(output => ['stdout', 'stderr'].includes(output.name))
    .forEach((output, index) => {
      (output.text || [])
        .forEach(text => {
          consoleOutputs.push(<AnsiDisplay text={text} file={output.name} key={`line-${consoleOutputs.length - 1}`} />);
        });
    });
  
  const displayOutputs = [];
  (cell.outputs || [])
    .filter(output => output.output_type === 'display_data')
    .forEach(output => {
    });

  return (
    <div>
      {/* html is sanitized by prerender.js using the HLJS HTML escape util */}
      <section className='code' dangerouslySetInnerHTML={{ __html: cell.source }}></section>
      {
        (consoleOutputs.length > 0) && (
          <section className='execute-output p-4'>
            <header className='block mb-[0.5em] text-md border-b border-b-slate-400 capitalize'>Console Logs</header>
            {consoleOutputs}
          </section>
        )
      }
    </div>
  );
};

export default JupyterCodeCellRenderer;
