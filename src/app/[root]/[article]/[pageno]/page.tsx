import { PUBLIC_PATH } from "app/util/Constants";
import path from "path";
import fs from 'fs/promises';

interface ArticlePageProps {
  params: Promise<{
    pageno: number;
  }>;
}

const ArticlePage: React.FC<ArticlePageProps> = async (props) => {
  const params = await props.params;

  return (
    <div>
      <h1>Root: {params.root}</h1>
      <h2>Article: {params.article}</h2>
      <h3>Article Page: {params.pageno}</h3>
    </div>
  )
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
