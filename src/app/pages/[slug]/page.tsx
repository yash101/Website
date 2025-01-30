import { Notebook } from "app/ipynb/notebook";
import { filepathMatchPages } from "app/util/filepath";
import { getNotebooksBySlug, readNotebooksIndex } from "app/util/FsUtil";
import JupyterPageRenderer from "components/JupyterPageRenderer";
import NotebookRenderer from "components/NotebookRenderer";
import fs from 'fs/promises';
import { notFound } from "next/navigation";
import path from 'path';

interface PageProps {
  params: Promise<{
    slug: string;
  }>
};

const SiteBasicPage: React.FunctionComponent<PageProps> = async (props) => {
  const slug = (await props.params).slug;
  const post = (await getNotebooksBySlug()).get(slug);

  if (!post || !filepathMatchPages(post.file))
    notFound();

  const fileName = path.join(process.cwd(), 'public', post.file);
  const notebook: Notebook = JSON.parse(await fs.readFile(fileName, 'utf8')) as Notebook;

  return <NotebookRenderer notebook={notebook} />;
}

export async function generateStaticParams() {
  const params = (await readNotebooksIndex())
    .notebooks
    .filter(notebook => filepathMatchPages(notebook.file))
    .map(notebook => {
      return {
        slug: notebook.slug,
      };
    });

  console.log('pages::[slug]::page.tsx::generateStaticParams(): ', params);
  return params;
}

export default SiteBasicPage;
export const dynamic = 'force-static';
