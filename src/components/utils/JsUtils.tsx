export function isNullOrUndefined(value: any): boolean {
  return [null, undefined].includes(value);
}

export function equalButNotNullOrUndefined(a: any, b: any): boolean {
  return a === b && ![null, undefined].includes(a);
}
