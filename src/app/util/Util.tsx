import { SIPage } from "notebook/types";
import { forceUnpublishedAsPublished } from "site-config";

export function singletonOrArrayToArray<T>(obj: T | T[]): T[] {
  if (!obj) {
    return [];
  }

  if (Array.isArray(obj)) {
    return obj;
  }

  return [ obj ];
}

export function isPagePublished(page: SIPage): boolean {
  return forceUnpublishedAsPublished || page.published;
}
