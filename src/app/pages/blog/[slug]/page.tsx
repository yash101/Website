import JupyterPageRenderer from "components/JupyterPageRenderer";
import fs from 'fs/promises';
import { NotebookContainer, NotebookIndexEntry, NotebooksIndex } from "jupyter/JupyterTypes";
import path from 'path';

interface BlogProps {
  params: Promise<{
    slug: string;
    index: NotebookIndexEntry;
    notebook: NotebookContainer;
  }>;
};

const BlogPage: React.FunctionComponent<BlogProps> = async (props) => {
  const params = await props.params;
  console.log('notebook: ', params);

  return (
    <article className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Blog Post</h1>
      <JupyterPageRenderer notebook={await params.notebook} />
    </article>
  )
}

export async function getStaticPaths() {
  const file: string = await fs.readFile(path.join(process.cwd(), 'public', 'notebooks.index.json'), 'utf-8');
  const index: NotebooksIndex = JSON.parse(file);

  const retVal = {
    paths: index.notebooks.map(notebook => {
      return {
        params: {
          slug: notebook.file.replace(/\.ipynb\.json$/, '').replace(/^notebooks\//, ''),
        },
      };
    }),
    fallback: false,
  };

  console.log(retVal);

  return retVal;
}

export async function generateStaticParams() {
  const file: string = await fs.readFile(path.join(process.cwd(), 'public', 'notebooks.index.json'), 'utf-8');
  const index: NotebooksIndex = JSON.parse(file);

  const nbPromises = index
    .notebooks
    .map(async nbMeta => {
      const notebookFile = await fs.readFile(path.join(process.cwd(), 'public', nbMeta.file), 'utf-8');
      return {
        slug: nbMeta.file.replace(/\.ipynb\.json$/, '').replace(/^notebooks\//, ''),
        index: nbMeta,
        notebook: JSON.parse(notebookFile) as NotebookContainer,
      };
    });
  
  return await Promise.all(nbPromises);
}

export default BlogPage;
