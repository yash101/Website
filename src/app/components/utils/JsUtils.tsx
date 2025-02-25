export function isNullOrUndefined(value: unknown): boolean {
  return [null, undefined].includes(value);
}

export function equalButNotNullOrUndefined(a: unknown, b: unknown): boolean {
  return a === b && ![null, undefined].includes(a);
}
