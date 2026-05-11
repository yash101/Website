import type { MetadataRoute } from 'next';
import path from 'path';

import { PIFormat, SIFormat } from 'notebook/types';
import { readJsonFile } from 'app/util/FsUtil';
import { site_url } from 'site-config';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: site_url,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  const rootIndex = await readJsonFile<PIFormat>('index.json');

  for (const root of Object.keys(rootIndex)) {
    const index = await readJsonFile<SIFormat>(path.join('indices', `${root}.index.json`));
    if (!index) {
      continue;
    }

    entries.push({
      url: `${site_url}/${root}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    for (const article of index.articles) {
      const publishedPages = article.pages.filter(page => page.published);
      if (publishedPages.length === 0) {
        continue;
      }

      entries.push({
        url: `${site_url}/${root}/${article.name}`,
        lastModified: article.lastModifiedOn ? new Date(article.lastModifiedOn) : undefined,
        changeFrequency: 'monthly',
        priority: 0.7,
      });

      for (const page of publishedPages.slice(1)) {
        entries.push({
          url: `${site_url}/${root}/${article.name}/${page.pageNumber}`,
          lastModified: page.lastModifiedOn ? new Date(page.lastModifiedOn) : undefined,
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
