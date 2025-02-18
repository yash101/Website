import { PUBLIC_PATH } from 'app/util/Constants';
import fs from 'fs/promises';
import path from 'path';

interface ArticleBasePageProps {
  params: Promise<{
    root: string;
    article: string;
  }>;
}

const ArticleBasePage: React.FC<ArticleBasePageProps> = async ({ params }) => {
  const { article, root } = (await params);

  return (
    <div>
      <h1>Root: {root}</h1>
      <h1>Article: {article}</h1>
    </div>
  );
}


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


export default ArticleBasePage;
