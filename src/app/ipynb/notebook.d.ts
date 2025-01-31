export type NotebookIndex = {
  notebooks: NotebookIndexEntry[];
}

export type NotebookIndexEntry = {
  title: string;
  author: string;
  lastModified: string | Date;
  published: string | Date;
  renderedHero: string;
  slug: string;
  file: string;
  [others: string]: string | object | null;
}

export type Notebook = {
  cells: NotebookCell[];
  metadata: NotebookMetadata;
  nbformat: '4';
  nbformat_minor?: string;
}

export type NotebookCell = {
  cell_type: 'markdown' | 'raw' | 'code';
  metadata?: object;
  source: string;
  outputs?: NotebookCellOutput[];
}

export type NotebookMetadata = {
  kernelspec?: object;
  language_info?: object;
  img?: ImageMetadata;
  pageinfo: NotebookPageInfo;
}
export type ImageMetadata = {
  [key: string]: object | null;
}

export type NotebookPageInfo = {
  title: string;
  author: string;
  lastModified: Date;
  published: Date;
}

export type NotebookCellOutput = {
  output_type: 'error' | 'stream';
  ename?: string;
  evalue?: string;
  text?: string[];
  traceback?: string[];
  name?: string;
}
