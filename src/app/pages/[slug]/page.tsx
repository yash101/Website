import { Notebook, NotebookIndex } from "app/ipynb/notebook";
import { getNotebooksBySlug, readNotebooksIndex } from "app/util/FsUtil";
import JupyterPageRenderer from "components/JupyterPageRenderer";
import fs from 'fs/promises';
import { notFound } from "next/navigation";
import path from 'path';

interface BlogProps {
  params: Promise<{
    slug: string;
  }>
};

function filepathMatch(filepath: string): boolean {
  return filepath.match(/^ipynb_pp\/pages\/.*.dnb$/) ? true : false;
}

const BlogPage: React.FunctionComponent<BlogProps> = async (props) => {
  const slug = (await props.params).slug;
  const post = (await getNotebooksBySlug()).get(slug);

  if (!post || !filepathMatch(post.file))
    notFound();

  const fileName = path.join(process.cwd(), 'public', post.file);
  const notebook: Notebook = JSON.parse(await fs.readFile(fileName, 'utf8')) as Notebook;

  return (
    <article className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Blog Post</h1>
      <JupyterPageRenderer notebook={notebook} />
    </article>
  )
}

export async function generateStaticParams() {
  return (await readNotebooksIndex())
    .notebooks
    .filter(notebook => filepathMatch(notebook.file))
    .map(notebook => {
      return {
        params: {
          slug: notebook.slug,
        },
      };
    });
}

export default BlogPage;
