// ***** User Types *****
export type SiteStructureJsonType = {
  [root: string]: SiteRootConfig;
}

export type SiteRootConfig = {
  rootType: string; // 'Blog' or 'Pages'
  pageTitle: string;
  menuTitle: string;
  displayArticlesInMenu?: boolean;
}

export type PageInfo = {
  root: string;
  name: string;
  page: number;
  title: string;
  subtitle: string;
  isPublished: boolean;
  author: string | string[];
  lastModifiedOn: string | Date;
  publishedOn: string | Date;
  [entry: string]: unknown;
}

// ***** Rendered page types *****

// *** Primary index (public/index.json) ***
// Theoretically we could get rid of this and just query the directory for indices. Allows for client-side generation.

export type PIFormat = {
  [root: string]: string;
}

// ***** Secondary index (public/indices/[root].index.json) *****

export type SIFormat = {
  base: string;               // name of the root, used as the URL
  config: SiteRootConfig;     // configuration for the root (copied from site-structure.json)
  articles: SIArticle[];      // articles in the root
}

export type SIArticle = {
  name: string;               // name of the article used as the URL
  id: string;                 // unique identifier for the article (i don't think this is actually needed anywhere)
  pages: SIPage[];            // pages in the article
  lastModifiedOn: Date;       // last modified date of the article
  lastPublishedOn: Date;      // last published date of the article
  firstPublishedOn: Date;     // first published date of the article
  hero: string;               // hero image for the article
}

export type SIPage = {
  nbPath: string;             // path to the notebook
  pageNumber: number;         // page number in the article
  title: string;              // title of the page
  published: boolean;         // whether the page is published
  publishedOn: Date;          // date the page was published
  lastModifiedOn: Date;       // date the page was last modified
  subtitle?: string;          // subtitle of the page
  authors: string[];          // authors of the page
}

// ***** Prerendered page types *****

export type PPPage = {
  cells: PPSection[];
  metadata: PPMetadata;
  additionalRawHtml: string | undefined | null;
}

export type PPSection = {
  cell_type: string;          // Cell type (markdown, code, etc.)
  source?: string;            // Cell source (used to be string[] in the ipynb format)
  outputs?: PPSectionOutput[];// Cell outputs (used to be object[] in the ipynb format)
}

export type PPMetadata = {
  img?: Record<string, PPImageMetadata>;
  pageinfo: Record<string, string | number | null>;
}

export type PPImageMetadata = {
  width?: number;
  height?: number;
  [key: string]: string | number | null;
}

export type PPSectionOutput = | {
  output_type: 'stream',
  name: 'stdout' | 'stderr',
  text: string | string[];
}
| {
  output_type: 'display_data' | 'execute_result' | 'error',
  data: Record<string, string | string[]>,
}
| {
  output_type: 'execute_result',
  data: Record<string, string | string[]>,
}
| {
  output_type: 'error',
  ename: string,
  evalue: string,
  traceback: string[],
}
