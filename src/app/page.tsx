import BlogHero from "components/BlogHero";
import { blog_title } from "site-config";
import { readNotebooksIndex } from "./util/FsUtil";
import { NotebookIndexEntry } from "./ipynb/notebook";
import AccordionWidget from 'components/widgets/Accordion';

function getPathForNotebook(index: NotebookIndexEntry) {
  if (index.file.match(/^ipynb_pp\/blogs.*/)) {
    return `/blog/${index.slug}`;
  } else if (index.file.match(/^ipynb_pp\/pages.*/)) {
    return `/pages/${index.slug}`;
  } else {
    return '/not-found';
  }
}

export default async function Home() {
  const posts = await readNotebooksIndex();

  return (
    <article className="px-4 py-8">
      <section>
        <h1 className="text-5xl font-bold mb-4">{blog_title}</h1>
      </section>
      <hr className="my-4" />
      <section className="">{
        posts
          .notebooks
          .map(notebook => (<BlogHero
              title={notebook.title}
              preview={notebook.renderedHero}
              key={notebook.file}
              href={getPathForNotebook(notebook)}
              author={notebook.author}
              published={new Date(notebook.published).toLocaleDateString()}
            />)
          )
      }</section>
    </article>
  );
}
