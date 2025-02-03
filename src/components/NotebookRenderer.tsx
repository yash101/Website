import { Notebook } from "app/ipynb/notebook";
import React from "react";
import JupyterPageRenderer from "./JupyterPageRenderer";
import PrintButton from "./PrintButton";

interface NotebookRendererProps {
  notebook: Notebook;
}

const NotebookRenderer: React.FC<NotebookRendererProps> = async ({ notebook }) => {
  return (
    <article className="container mx-auto px-4 py-8">
      <header>
        <h1 className="text-5xl font-bold mb-4">{notebook.metadata.pageinfo.title}</h1>
        <div className="text-slate-700 dark:text-slate-200 flex justify-between items-center">
          <div role="contentinfo">
            <p>Author: <span itemProp="author">{notebook.metadata.pageinfo.author || 'unknown'}</span></p>
            <p>Published: <span itemProp="datePublished">{new Date(notebook.metadata.pageinfo.published).toLocaleDateString()}</span></p>
            <p>Updated: <span itemProp="datePublished">{new Date(notebook.metadata.pageinfo.lastModified).toLocaleDateString()}</span></p>
          </div>
          <div role="menu">
            <PrintButton />
          </div>
        </div>
        <hr className="mb-[1em] mt-[0.5em]" />
      </header>
      <main>
        <JupyterPageRenderer notebook={notebook} />
      </main>
    </article>
  )
}

export default NotebookRenderer;
