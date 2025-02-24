import fs from 'fs/promises';
import path from 'path';
import { PUBLIC_PATH } from './Constants';
import { SecondaryIndex, SiteStructureFormat } from 'notebook/types';

export interface SidebarItem {
  name?: string;
  title?: string;
  href?: string;
  children: SidebarItem[];
}

export interface SidebarContent {
  roots: SidebarItem[];
}

export async function readJson(path: string): Promise<object | null> {
  return await fs
    .readFile(path, 'utf8')
    .then(JSON.parse)
    .catch(err => {
      console.error(`Error reading JSON file at ${path}: ${err}`);
      return null;
    });
}

export function getPathInPublic(...paths: string[]): string {
  return path.join(PUBLIC_PATH, ...paths);
}

export async function getSidebarContent(): Promise<SidebarContent> {
  const mainRoot = await readJson(getPathInPublic('index.json'));

  if (!mainRoot) {
    return {
      roots: [],
    };
  }

  const children = await Promise.all(Object.entries(mainRoot)
    .map(async ([root, filename]) => {
      const index: SecondaryIndex =
        await readJson(getPathInPublic('indices', filename)) as SecondaryIndex;

      if (!index) {
        return null;
      }

      const content: SidebarItem = {
        name: index.config.menu || '',
        title: index.config.title,
        href: `/${root}`,
        children: (index.config.articlesInMenu === true) ? index.articles
          .filter(article => {
            return article.pages.filter(page => page.published).length > 0;
          })
          .map(article => ({
            name: article.name,
            title: article.pages[0].title,
            href: `/${root}/${article.name}`,
            children: null
          }) as SidebarItem) : [],
      };

      return content;
    }));

  return {
    roots: children,
  };
}
