import fs from 'fs/promises';
import path from "path";

import { PUBLIC_PATH } from "app/util/Constants";
import { PIFormat, SIFormat } from 'notebook/types';

import RootViewBlog from 'app/components/views/RootViewBlog';
import { readJsonFile } from 'app/util/FsUtil';

interface RootPageProps {
  params: Promise<{
    root: string;
  }>;
}

const RootPage: React.FC<RootPageProps> = async ({ params }) => {
  const { root } = (await params);
  const rootIndex: SIFormat = await fs.readFile(path.join(PUBLIC_PATH, 'indices', `${root}.index.json`), 'utf8').then(JSON.parse);

  return (<RootViewBlog index={rootIndex} />);
};

export async function generateStaticParams() {
  const roots: PIFormat = await readJsonFile<PIFormat>('index.json');
  const ret = Object.keys(roots).map(root => ({ root }));

  return ret;
}

export default RootPage;
