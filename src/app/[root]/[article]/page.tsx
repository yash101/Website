import path from 'path';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Separator } from '@/components/ui/separator';
import PrerenderedHtmlRenderer from 'components/renderer/PrerenderedHtmlRenderer';
import TableOfContents from 'components/utils/TableOfContents';
import ArticleMainPageRenderer from 'components/views/ArticleMainPageRenderer';
import ArticlePageHeader from 'components/views/ArticlePageHeader';

import { PIFormat, PPPage, SIFormat } from 'notebook/types';
import { readJsonFile } from 'app/util/FsUtil';
import IntraPagePagination from 'components/utils/IntraPagePagination';
import { MoveRight } from 'lucide-react';

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

    const authors = Array.isArray(article.pages[0].authors) ?
      article.pages[0].authors.join(', ') : article.pages[0].authors;

    return (
      <article className='space-y-4 ml-2 py-4'>
        <ArticlePageHeader
          title={article.pages[0].title || 'untitled'}
          subtitle={article.pages[0].subtitle || 'untitled'}
          authors={authors}
          lastPublishedOn={article.lastPublishedOn}
          lastModifiedOn={article.lastModifiedOn}
        />
        <Separator />
        <section>
          <PrerenderedHtmlRenderer html={article.hero} notebook={null} />
        </section>
        <Separator />
        {
          article.pages.length > 1 && (
            <TableOfContents
              links={article.pages.map((page, index) => ({
                href: `/${params.root}/${params.article}/${page.pageNumber}`,
                text: page.subtitle,
              }))}
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
        <section className='flex justify-between'>
        <div className='md:w-[48%]'><div></div></div>
        <div className='mg:w-[48%] text-right'>
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
