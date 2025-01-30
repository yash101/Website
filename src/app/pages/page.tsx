import { filepathMatchPages } from "app/util/filepath";
import { readNotebooksIndex } from "app/util/FsUtil";
import { notFound } from "next/navigation";

export default function BasePage (): never {
  notFound();
}
