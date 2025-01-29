import JupyterPageRenderer from "components/JupyterPageRenderer";
import fs from 'fs/promises';
import { NotebookContainer, NotebookIndexEntry, NotebooksIndex } from "jupyter/JupyterTypes";
import path from 'path';

interface BlogProps {
  params: Promise<{
    slug: string;
  }>
};

const BlogPage: React.FunctionComponent<BlogProps> = async (props) => {
  const params = await props.params;
  const slug = params.slug;
  const notebook = JSON.parse(
    await fs.readFile(path.join(process.cwd(), 'public', 'notebooks', `${slug}.ipynb.json`), 'utf-8')) as NotebookContainer;

  return (
    <article className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Blog Post</h1>
      <JupyterPageRenderer notebook={notebook} />
    </article>
  )
}

export async function generateStaticParams() {
  const file: string = await fs.readFile(path.join(process.cwd(), 'public', 'notebooks.index.json'), 'utf-8');
  const index: NotebooksIndex = JSON.parse(file);

  const nbPromises = index
    .notebooks
    .map(async nbMeta => {
      return {
        params: {
          slug: nbMeta.file.replace(/\.ipynb\.json$/, '').replace(/^notebooks\//, ''),
        }
      };
    });
  
  return nbPromises;
}

export default BlogPage;
