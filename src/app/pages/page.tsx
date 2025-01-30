import { filepathMatchPages } from "app/util/filepath";
import { readNotebooksIndex } from "app/util/FsUtil";
import { notFound } from "next/navigation";

export default function BasePage (): never {
  notFound();
}

// export async function generateStaticParams() {
//   return (await readNotebooksIndex())
//   .notebooks
//   .filter(notebook => filepathMatchPages(notebook.file))
//   .map(notebook => {
//     return {
//       params: {
//         slug: notebook.slug,
//       },
//     };
//   });
// }
