import { SIArticle, SIPage } from "notebook/types";

export function getPreviousAndNextPage(pages: SIPage[], currentPage: number) {
  const currentIndex = pages.findIndex(
    page => String(page.pageNumber) === String(currentPage));

    if (currentIndex === -1) {
    return {
      prev: null,
      next: null
    };
  }

  const prev = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const next = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  return {
    prev,
    next
  };
}
