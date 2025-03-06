/*
  Index characteristics

  * Multiple roots (blog, pages, etc.)
  * Pages all have metadata
  * Page metadata contains "root", "name", "page" and other fields
 */

export class Indexer {
  constructor() {
    this.notebooks = [];
    this.roots = {};
    this.siteStructure = {
      roots: {}
    };
    this.names = {};
    this.heros = {};
  }

  setSiteStructure(structure) {
    this.siteStructure = structure;
  }

  addNotebook(notebook) {
    this.notebooks.push(notebook);
  }

  generateIndex() {
    for (const { notebook, path } of this.notebooks) {
      const pageinfo = notebook.metadata.pageinfo;
      const root = pageinfo.root;
      const name = pageinfo.name;
      const page = Number(pageinfo.page) || 0;
      const isPublished = pageinfo.isPublished;
      const title = pageinfo.title || '';
      const publishedOn = pageinfo.publishedOn || new Date();
      const lastModifiedOn = pageinfo.lastModifiedOn || new Date();
      const subtitle = pageinfo.subtitle || '';
      const id = root + '.' + name;
      let authors = pageinfo.authors || pageinfo.author || [];

      if (authors instanceof String) {
        authors = [ authors ];
      }

      if (!root) {
        console.warn(`Notebook ${path} has no root`);
        continue;
      }

      if (!this.roots[root]) {
        this.roots[root] = {
          base: root,
          config: this.siteStructure.roots[root] || {},
          articles: []
        };
      }

      const articles = this.roots[root].articles;
      let article = articles.find(article => article.name === name);
      if (!article) {
        article = {
          name,
          id,
          pages: [],
        };
        articles.push(article);
      }

      if (article.pages.find(page => page.pageNumber === page)) {
        console.warn(`Notebook ${path} possibly is a duplicate page. Skipping.`);
        continue;
      }

      article.pages.push({
        nbPath: path,
        pageNumber: page,
        title,
        published: isPublished ? true : false,
        publishedOn,
        lastModifiedOn,
        subtitle,
        authors,
        hero: notebook.cells[0].source,
      });
    }

    for (const root of Object.keys(this.roots)) {
      this.names[root] = `${root}.index.json`;

      const articles = this.roots[root].articles;
      for (const article of articles) {
        let minPublishedOn = null;
        let maxPublishedOn = null;
        let lastPageUpdatedOn = null;

        article.pages.sort((a, b) => {
          return a.pageNumber - b.pageNumber;
        });

        article.hero = article.pages[0].hero;

        for (const page of article.pages.filter(page => page.published)) {
          // We don't need this in the index currently
          delete page.hero;

          if (page.published) {
            if (!minPublishedOn || page.publishedOn < minPublishedOn) {
              minPublishedOn = page.publishedOn;
            }

            if (!maxPublishedOn || page.publishedOn > maxPublishedOn) {
              maxPublishedOn = page.publishedOn;
            }
          }

          if (!lastPageUpdatedOn || page.lastModifiedOn > lastPageUpdatedOn) {
            lastPageUpdatedOn = page.lastModifiedOn;
          }
        }

        article.lastModifiedOn = lastPageUpdatedOn;
        article.lastPublishedOn = maxPublishedOn;
        article.firstPublishedOn = minPublishedOn;
      }
    }
  }

  getIndex() {
    return {
      names: this.names,
      indices: this.roots
    };
  }
}
