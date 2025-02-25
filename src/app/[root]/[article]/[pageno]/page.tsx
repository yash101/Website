import path from "path";

import { Metadata } from 'next'
import { notFound } from "next/navigation";
import { ErrorBoundary } from 'react-error-boundary';
import { MoveLeft, MoveRight } from 'lucide-react';

import { Separator } from "@/components/ui/separator";

import { PIFormat, PPPage, SIFormat } from "notebook/types";
import { readJsonFile } from 'app/util/FsUtil';
import { getPreviousAndNextPage } from 'app/util/PaginationUtil';

import ArticlePageHeader from 'app/components/views/ArticlePageHeader';
import PrerenderedHtmlRenderer from 'app/components/renderer/PrerenderedHtmlRenderer';
import TableOfContents from 'app/components/utils/TableOfContents';
import ArticleSubpageRenderer from 'app/components/views/ArticleSubpageRenderer';
import IntraPagePagination from 'app/components/utils/IntraPagePagination';

/**
 * Generates metadata for an article page.
 *
 * @param props - The properties for the article page.
 * @returns A promise that resolves to the metadata for the page.
 *
 * @remarks
 * This function reads the index file for the specified root and finds the article
 * by name. It then returns the metadata for the first page of the article.
 *
 * @example
 * ```typescript
 * const metadata = await generateMetadata({ params: { root: 'blog', article: 'my-article', pageno: '1' } });
 * console.log(metadata.title); // Outputs the title of the first page of the article
 * ```
 *
 * @see {@link https://nextjs.org/docs/api-reference/next/head Head API Reference}
 *
 * @typedef {Object} Metadata
 * @property {string} title - The title of the page.
 * @property {string} description - The description of the page.
 *
 * @typedef {Object} ArticlePageProps
 * @property {Object} params - The parameters for the article page.
 * @property {string} params.root - The root directory of the article.
 * @property {string} params.article - The name of the article.
 * @property {string} params.pageno - The page number of the article.
 *
 * @typedef {Object} SIFormat
 * @property {Array} articles - The list of articles.
 * @property {string} articles.name - The name of the article.
 * @property {Array} articles.pages - The list of pages in the article.
 * @property {string} articles.pages.title - The title of the page.
 * @property {string} articles.pages.subtitle - The subtitle of the page.
 *
 * @list HTML Metadata
 * - `title`: The title of the document.
 * - `description`: A brief description of the document.
 * - `keywords`: A comma-separated list of keywords relevant to the document.
 * - `author`: The name of the author of the document.
 * - `viewport`: The viewport settings for responsive web design.
 * - `charset`: The character encoding for the document.
 * - `robots`: Instructions for web crawlers about the document.
 * - `canonical`: The canonical URL of the document.
 */
export async function generateMetadata(props: ArticlePageProps): Promise<Metadata> {
  const params = await props.params;
  const index = await readJsonFile<SIFormat>(`indices/${params.root}.index.json`);
  const article = index.articles.find(a => a.name === params.article);
  
  return {
    title: article?.pages[0].title,
    description: article?.pages[0].subtitle,
    // Add other metadata as needed
  };
}

interface ArticlePageProps {
  params: Promise<{
    root: string;
    article: string;
    pageno: number;
  }>;
}

const ArticlePage: React.FC<ArticlePageProps> = async (props) => {
  const params = await props.params;

  const index = await readJsonFile<SIFormat>(`indices/${params.root}.index.json`);
  const article = index.articles.find(a => a.name === params.article);

  if (!article) {
    notFound();
  }

  const pageIndex = article.pages.find(p => String(p.pageNumber) === String(params.pageno));
  if (!pageIndex) {
    notFound();
  }

  const page = await readJsonFile<PPPage>(pageIndex.nbPath);
  
  const authors: string = Array.isArray(page.metadata.pageinfo['authors']) ?
    page.metadata.pageinfo['authors'].join(', ') :
    page.metadata.pageinfo.authors as string;
  
  const pagination = getPreviousAndNextPage(article, params.pageno);

  return (
    <article className='space-y-4 mx-2 py-4'>
      <ArticlePageHeader
        title={pageIndex.title}
        subtitle={pageIndex.subtitle}
        authors={authors}
        lastPublishedOn={page.metadata.pageinfo.publishedOn as string}
        lastModifiedOn={page.metadata.pageinfo.lastModifiedOn as string}
      />
      <Separator />
      <section>
        <PrerenderedHtmlRenderer html={article.hero} notebook={null} />
      </section>
      <Separator />
      <TableOfContents
        links={article.pages.map((page, index) => ({
          href: `/${params.root}/${params.article}/${page.pageNumber}`,
          text: page.subtitle,
          pageNumber: page.pageNumber,
        }))}
        currentPageNumber={params.pageno}
      />
      <section>
        <ErrorBoundary fallback={<div>Error loading content</div>}>
          <ArticleSubpageRenderer
            page={page}
            root={params.root}
            name={params.article}
            pageno={params.pageno}
          />
        </ErrorBoundary>
      </section>

      <section className='flex justify-between'>
        <div className='md:w-[48%]'>
          {pagination.prev && (
            <IntraPagePagination
              href={`/${params.root}/${params.article}/${pagination.prev.pageNumber}`}
              text={`${pagination.prev.subtitle}`}
              icon={<MoveLeft />}
              iconPosition='left'
              pretext='Previous'
            />
          )}
        </div>
        <div className='mg:w-[48%] text-right'>
          {pagination.next && (
            <IntraPagePagination
              href={`/${params.root}/${params.article}/${pagination.next.pageNumber}`}
              text={`${pagination.next.subtitle}`}
              icon={<MoveRight />}
              iconPosition='right'
              pretext='Next'
            />
          )}
        </div>
      </section>
    </article>
  );
};

export async function generateStaticParams() {
  const routes = [];
  const rootIndex = await readJsonFile<PIFormat>(`index.json`);
  for (const root of Object.keys(rootIndex)) {
    const secondaryIndex: SIFormat = await readJsonFile(path.join('indices', `${root}.index.json`));

    for (const article of secondaryIndex.articles) {
      for (const page of article.pages) {
        routes.push({
          root,
          article: article.name,
          pageno: `${page.pageNumber}`,
        });
      }
    }
  }

  return routes;
}

export default ArticlePage;
