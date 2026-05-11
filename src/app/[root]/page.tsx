import fs from 'fs/promises';
import path from "path";
import type { Metadata } from 'next';

import { PUBLIC_PATH } from "app/util/Constants";
import { PIFormat, SIFormat } from 'notebook/types';

import RootViewBlog from 'app/components/views/RootViewBlog';
import { readJsonFile } from 'app/util/FsUtil';
import { buildMetadata } from 'app/util/metadata';
import { site_description, site_title } from 'site-config';

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

export async function generateMetadata({ params }: RootPageProps): Promise<Metadata> {
  const { root } = await params;
  const index = await readJsonFile<SIFormat>(`indices/${root}.index.json`);
  const title = index?.config?.pageTitle || root;
  const description = `Browse ${title} on ${site_title}. ${site_description}`;

  return buildMetadata({
    title,
    description,
    path: `/${root}`,
    type: 'website',
  });
}

export async function generateStaticParams() {
  const roots: PIFormat = await readJsonFile<PIFormat>('index.json');
  const ret = Object.keys(roots).map(root => ({ root }));

  return ret;
}

export default RootPage;
