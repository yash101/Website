export function singletonOrArrayToArray<T>(obj: T | T[]): T[] {
  if (!obj) {
    return [];
  }

  if (Array.isArray(obj)) {
    return obj;
  }

  return [ obj ];
}
