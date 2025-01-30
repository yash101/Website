import { Notebook } from "app/ipynb/notebook";
import { filepathMatchPages } from "app/util/filepath";
import { getNotebooksBySlug, readNotebooksIndex } from "app/util/FsUtil";
import JupyterPageRenderer from "components/JupyterPageRenderer";
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

  return (
    <article className="container mx-auto px-4 py-8">
      <header>
        <h1 className="text-5xl font-bold mb-4">{notebook.metadata.pageinfo.title}</h1>
        <div className="text-slate-700 dark:text-slate-200">
          <p>Author: <span itemProp="author">{notebook.metadata.pageinfo.author || 'unknown'}</span></p>
          <p>Published: <span itemProp="datePublished">{new Date(notebook.metadata.pageinfo.published).toLocaleDateString()}</span></p>
          <p>Updated: <span itemProp="datePublished">{new Date(notebook.metadata.pageinfo.lastModified).toLocaleDateString()}</span></p>
        </div>
        <hr className="mb-[1em] mt-[0.5em]" />
      </header>
      <main>
        <JupyterPageRenderer notebook={notebook} />
      </main>
    </article>
  )
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
