import { Separator } from "@/components/ui/separator";
import { NotebookIndex } from "app/ipynb/notebook";
import { readNotebooksIndex } from "app/util/FsUtil";
import { blog_title } from "site-config";
import BlogHero from "components/BlogHero";
import { filepathMatchBlogs } from "app/util/filepath";

export default async function BlogHome() {
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
          .filter(notebook => filepathMatchBlogs(notebook.file))
          .map(notebook => (<BlogHero
              title={notebook.title}
              preview={notebook.renderedHero}
              key={notebook.file}
              href={`/blog/${notebook.slug}`}
              author={notebook.author}
              published={new Date(notebook.published).toLocaleDateString()}
            />)
          )
      }</section>
    </article>
  );
};

