import path from 'path';

import { PIFormat, SIFormat } from 'notebook/types';
import { readJsonFile } from './FsUtil';
import { isPagePublished } from './Util';

export interface SidebarItem {
  name?: string;
  title?: string;
  href?: string;
  children: SidebarItem[];
}

export interface SidebarContent {
  roots: SidebarItem[];
}

export async function getSidebarContent(): Promise<SidebarContent> {
  const mainRoot = await readJsonFile<PIFormat>('index.json');

  if (!mainRoot) {
    return {
      roots: [],
    };
  }

  const children = await Promise.all(Object.entries(mainRoot)
    .map(async ([root, filename]) => {
      const index: SIFormat =
        await readJsonFile<SIFormat>(path.join('indices', filename));

      if (!index) {
        return null;
      }

      const content: SidebarItem = {
        name: index.config.menuTitle || '',
        title: index.config.menuTitle || 'Untitled',
        href: index.config.linkInMenu ? `/${root}` : null,
        children: (index.config.displayArticlesInMenu === true) ? index.articles
          .filter(article => {
            return article.pages.filter(isPagePublished).length > 0;
          })
          .map(article => ({
            name: article.name,
            title: article.pages[0].title,
            href: `/${root}/${article.name}`,
            children: null
          }) as SidebarItem) : [],
      };

      return content;
    }))

  return {
    roots: children.filter(child => child.children.length > 0),
  };
}
