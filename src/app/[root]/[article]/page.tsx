import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MoveRight } from 'lucide-react';

import { Separator } from '@/components/ui/separator';

import { PIFormat, PPPage, SIFormat } from 'notebook/types';
import { readJsonFile } from 'app/util/FsUtil';

import ArticlePageHeader from 'app/components/views/ArticlePageHeader';
import TableOfContents from 'app/components/utils/TableOfContents';
import ArticleMainPageRenderer from 'app/components/views/ArticleMainPageRenderer';
import IntraPagePagination from 'app/components/utils/IntraPagePagination';
import Head from 'next/head';
import { site_title } from 'site-config';

interface ArticleBasePageProps {
  params: Promise<{
    root: string;
    article: string;
  }>;
}

const ArticleBasePage: React.FC<ArticleBasePageProps> = async (props) => {
  const params = await props.params;

  try {
    const index: SIFormat = await readJsonFile<SIFormat>(`indices/${params.root}.index.json`);
    const article = index.articles.find(a => a.name === params.article);
    const page: PPPage = await readJsonFile<PPPage>(article.pages[0].nbPath);

    const publishedPages = article.pages.filter(p => p.published);
    const authors = Array.isArray(article.pages[0].authors) ?
      article.pages[0].authors.join(', ') : article.pages[0].authors;
    

    return (
      <article className='space-y-4 mx-2 py-4'>
        <Head>
          <title>{article.pages[0].title} - {site_title}</title>
          <meta name='description' content={article.pages[0].subtitle} />
        </Head>
        <ArticlePageHeader
          title={article.pages[0].title || 'untitled'}
          subtitle={article.pages[0].subtitle || 'untitled'}
          authors={authors}
          lastPublishedOn={article.lastPublishedOn}
          lastModifiedOn={article.lastModifiedOn}
        />
        <Separator />
        {
          article.pages.length > 1 && (
            <TableOfContents
              links={publishedPages.map(page => ({
                href: `/${params.root}/${params.article}/${page.pageNumber}`,
                text: page.subtitle,
                pageNumber: page.pageNumber,
              }))}
              currentPageNumber={article.pages[0].pageNumber}
            />
          )
        }
        <section>
          <ArticleMainPageRenderer
            page={page}
            root={params.root}
            name={params.article}
            pageno={article.pages[0].pageNumber}
          />
        </section>
        <section className='flex justify-between gap-4'>
        <div>
          <div></div>
        </div>
        <div className='text-right'>
          {article.pages.length > 1 && (
            <IntraPagePagination
              href={`/${params.root}/${params.article}/${article.pages[1].pageNumber}`}
              text={`Next: ${article.pages[1].subtitle}`}
              icon={<MoveRight />}
              pretext='Next'
              iconPosition='right'
            />
          )}
        </div>
      </section>
      </article>
    );
  } catch (e) {
    console.error(e);
    return notFound();
  }
}

export async function generateStaticParams() {
  const routes = [];
  const rootIndex = await readJsonFile<PIFormat>(`index.json`);
  for (const root of Object.keys(rootIndex)) {
    const secondaryIndex: SIFormat =
      await readJsonFile<SIFormat>(path.join('indices', `${root}.index.json`));

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

export async function generateMetadata(props: ArticleBasePageProps): Promise<Metadata> {
  const params = await props.params;
  const index = await readJsonFile<SIFormat>(`indices/${params.root}.index.json`);
  const article = index.articles.find(a => a.name === params.article);
  
  return {
    title: article?.pages[0].title,
    description: article?.pages[0].subtitle,
    // Add other metadata as needed
  };
}

export default ArticleBasePage;
