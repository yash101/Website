// Maps a root name to the index filename
export type MainIndex = {
  [root: string]: string;
};

// Configures how a root's page is displayed
// Example: /blog - what type of page do you see if you visit /blog?
// Also configures how the root should be treated. Add to the menu? Or not?
// Also configures the name of the menu item.
export type RootConfig = {
  type: string; // 'Blog' or 'Pages'
  title: string;
  menu?: string;
  articlesInMenu?: boolean;
};

export type SitePage = {
  nbPath: string;
  pageNumber: number;
  title: string;
  published: boolean;
  publishedOn: Date;
  lastModifiedOn: Date;
  subtitle?: string;
  hero: NotebookCell;
  authors: string[];
};

export type SiteArticle = {
  name: string;
  pages: SitePage[];
  lastModifiedOn: Date;
  lastPublishedOn: Date;
  firstPublishedOn: Date;
  hero: string;
};

// Mapts a root to its configuration (RootConfig) and articles (including pages)
export type SecondaryIndex = {
  base: string; // Name of the root
  config: RootConfig;
  articles: SiteArticle[];
};

// This isn't really used in the codebase.
// Type definition for notebooks/_site-structure.json
export type SiteStructureFormat = {
  [root: string]: RootConfig;
};

export type CodeOutputDataSections = {
  [mime: string]: string | string[];
};

export type CodeCellOutput = {
  output_type: string;
  name?: string;
  text?: string[];
  traceback?: string[];
  evalue?: string;
  outputs: object[];
}

export type NotebookCell = {
  cell_type: string; // 'markdown', 'code', 'raw'
  source: string;
  outputs: CodeCellOutput[];
}
