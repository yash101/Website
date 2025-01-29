interface NotebookContainer {
  sections: NotebookSection[];
  meta: NotebookMetadata;
}

interface NotebookMetadata {
  title: string;
  lastModified: string;
  published: string;
  author: string;
}

interface NotebookSection {
  type: string;
  content?: string;
  output?: string;
}

interface NotebookIndexEntry {
  title: string,
  author: string,
  lastModified: string,
  published: string,
  file: string,
};

interface NotebooksIndex {
  notebooks: NotebookIndexEntry[];
}

export type {
  NotebookContainer,
  NotebookMetadata,
  NotebookSection,
  NotebookIndexEntry,
  NotebooksIndex,
};
