export function getArticlePath(root: string, article: string): string {
  return `/${root}/${article}`;
}

export function getArticlePagePath(
  root: string,
  article: string,
  pageNumber: number,
  firstPageNumber?: number
): string {
  const articlePath = getArticlePath(root, article);

  if (String(pageNumber) === String(firstPageNumber)) {
    return articlePath;
  }

  return `${articlePath}/${pageNumber}`;
}

export function getArticlePagePathFromBase(
  basePath: string,
  pageNumber: number,
  firstPageNumber?: number
): string {
  const normalizedBasePath = basePath.replace(/\/$/, '');

  if (String(pageNumber) === String(firstPageNumber)) {
    return normalizedBasePath;
  }

  return `${normalizedBasePath}/${pageNumber}`;
}
