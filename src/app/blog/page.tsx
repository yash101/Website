import { Separator } from "@/components/ui/separator";
import { NotebookIndex } from "app/ipynb/notebook";
import { readNotebooksIndex } from "app/util/FsUtil";
import { blog_title } from "site-config";
import BlogHero from "components/BlogHero";
import { filepathMatchBlogs } from "app/util/filepath";

export default async function BlogHome() {
  const posts = await readNotebooksIndex();

  return (
    <article>
      <section>
        <h1>{blog_title}</h1>
      </section>
      <Separator />
      <section className="blog-hero ">{
        posts
          .notebooks
          .filter(notebook => filepathMatchBlogs(notebook.file))
          .map(notebook => (<BlogHero title={notebook.title} preview={notebook.renderedHero} key={notebook.file} />))
      }</section>
    </article>
  );
};

// export async function generateStaticParams() {
//   return (await readNotebooksIndex())
//   .notebooks
//   .filter(notebook => filepathMatchBlogs(notebook.file))
//   .map(notebook => {
//     return {
//       params: {
//         slug: notebook.slug,
//       },
//     };
//   });
// }
