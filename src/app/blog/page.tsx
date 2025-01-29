import { Separator } from "@/components/ui/separator";
import { NotebookIndex } from "app/ipynb/notebook";
import { readNotebooksIndex } from "app/util/FsUtil";
import { blog_title } from "site-config";
import { filepathMatch } from "./[slug]/page";
import BlogHero from "components/BlogHero";

export default async function BlogHome() {
  const posts = await readNotebooksIndex();

  return (
    <article>
      <section>
        <h1>{blog_title}</h1>
      </section>
      <Separator />
      <section>{
        posts
          .notebooks
          .filter(notebook => filepathMatch(notebook.file))
          .map(notebook => (<BlogHero title={notebook.title} preview={notebook.renderedHero} key={notebook.file} />))
      }</section>
    </article>
  );
};
