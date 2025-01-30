import fs from 'fs/promises';
import path from 'path';
import { NotebookIndex, NotebookIndexEntry } from "app/ipynb/notebook";
import { memoizeIndex } from 'site-config';

let notebooksIndex: NotebookIndex | null = null;
let notebooksBySlug: Map<string, NotebookIndexEntry> | null = null;

export async function readNotebooksIndex(): Promise<NotebookIndex> {
  const file: string = await fs.readFile(path.join(process.cwd(), 'public', 'ipynb_index.json'), 'utf8');
  const index = JSON.parse(file) as NotebookIndex;

  if (notebooksIndex === null && memoizeIndex === true) {
    notebooksIndex = index;
  }

  return (memoizeIndex) ? notebooksIndex || index : index;
}

export async function getNotebooksBySlug(): Promise<Map<string, NotebookIndexEntry>> {
  const notebookIndex = await readNotebooksIndex();

  if (memoizeIndex === true && notebooksBySlug !== null) {
    return notebooksBySlug;
  }

  const entries = new Map();
  if (notebooksBySlug === null) {
    for (const entry of notebookIndex?.notebooks) {
      entries.set(entry.slug, entry);
    }
    
    if (memoizeIndex === true) {
      notebooksBySlug = entries;
    }
  }

  return (memoizeIndex) ? notebooksBySlug as Map<string, NotebookIndexEntry>
    : entries;
}

if (!memoizeIndex)
  console.warn('FsUtil::memoize = false. May result in significant performance penalty.');
