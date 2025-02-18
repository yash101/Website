import fs from 'fs/promises';
import path from "path";
import { PUBLIC_PATH } from "app/util/Constants";
import RootViewBlog from 'app/components2/views/RootViewBlog';

interface RootPageProps {
  params: Promise<{
    root: string;
  }>;
}

const RootPage: React.FC<RootPageProps> = async ({ params }) => {
  const { root } = (await params);
  const rootIndex = await fs.readFile(path.join(PUBLIC_PATH, 'indices', `${root}.index.json`), 'utf8').then(JSON.parse);

  const rootTitle: string = rootIndex['title'] || '';

  return (<RootViewBlog index={rootIndex} />);
};

export async function generateStaticParams() {
  const posts = await fs.readFile(path.join(PUBLIC_PATH, '/index.json'), 'utf8').then(JSON.parse);
  const ret = Object
    .keys(posts)
    .map(root => ({ root }));

  return ret;
}

export default RootPage;
