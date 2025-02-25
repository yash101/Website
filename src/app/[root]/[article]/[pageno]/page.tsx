import { PUBLIC_PATH } from "app/util/Constants";
import path from "path";
import fs from 'fs/promises';
import { PPPage, SIFormat } from "notebook/types";
import { Calendar, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import PrerenderedHtmlRenderer from "app/components2/renderer/PrerenderedHtmlRenderer";
import ArticleSubpageRenderer from "app/components2/views/ArticleSubpageRenderer";
import TableOfContents from "app/components2/utils/TableOfContents";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{
    root: string;
    article: string;
    pageno: number;
  }>;
}

const ArticlePage: React.FC<ArticlePageProps> = async (props) => {
  const params = await props.params;

  const index: SIFormat = await fs
    .readFile(path.join(PUBLIC_PATH, 'indices', `${params.root}.index.json`), 'utf8')
    .then(JSON.parse) as SIFormat;
  
  const article = index.articles
    .find(a => a.name === params.article);

  // page numbers are from the user. the array should be sorted though.
  const pageIndex = article.pages.find(p => String(p.pageNumber) === String(params.pageno));
  if (!pageIndex) {
    notFound();
  }

  const filename = pageIndex.nbPath;

  const page = await fs
    .readFile(path.join(PUBLIC_PATH, filename), 'utf8')
    .then(JSON.parse) as PPPage;
  
  const authors = Array.isArray(page.metadata.pageinfo['authors']) ?
    page.metadata.pageinfo['authors'].join(', ') :
    page.metadata.pageinfo.authors;

  return (
    <article
      className='space-y-4 ml-2 py-4'
    >
      <header>
        <h1
          className='font-bold text-4xl'
        >
          { article.pages[0].title }
        </h1>
        {
          article.pages[0].subtitle && (
            <h2
              className='text-2xl'
            >
              { article.pages[0].subtitle }
            </h2>
          )
        }
        <div
          className='mt-2'
        >
          {authors && <p><User className='inline-block size-[1em]' /> { authors }</p>}
          <p><Calendar className='inline-block size-[1em]' /> Published { new Date(article.lastPublishedOn).toLocaleDateString() }</p>
          <p><Calendar className='inline-block size-[1em]' /> Updated { new Date(article.lastModifiedOn).toLocaleDateString() }</p>
        </div>
      </header>
      <Separator />
      <section>
        <PrerenderedHtmlRenderer html={article.hero} notebook={null} />
      </section>
      <TableOfContents
        links={article.pages.map((page, index) => ({
          href: `/${params.root}/${params.article}/${page.pageNumber}`,
          text: page.subtitle,
          pageNumber: page.pageNumber,
        }))}
        currentPageNumber={params.pageno}
      />
      <section>
        <ArticleSubpageRenderer
          page={page}
          root={params.root}
          name={params.article}
          pageno={article.pages[0].pageNumber}
        />
      </section>
    </article>
  );
};

export async function generateStaticParams() {
  const routes = [];

  const rootIndex = await fs.readFile(path.join(PUBLIC_PATH, `index.json`), 'utf8').then(JSON.parse);
  for (const root of Object.keys(rootIndex)) {
    const secondaryIndex = await fs.readFile(path.join(PUBLIC_PATH, 'indices', `${root}.index.json`), 'utf8').then(JSON.parse);
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
